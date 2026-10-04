'use server'

import { headers } from 'next/headers'
import { cms } from '@/lib/cms'
import { readLead, validateLead, type LeadErrors, type LeadInput } from '@/lib/lead'

export type SubmitState =
  | { status: 'idle' }
  | { status: 'invalid'; errors: LeadErrors; values: LeadInput }
  | { status: 'error'; message: string; values: LeadInput }
  | { status: 'success' }

// Simple in-memory rate limit: 5 submissions per IP per 10 minutes (single-instance hosting).
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5
const hits = new Map<string, number[]>()

function rateLimited(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > MAX_PER_WINDOW
}

const TYPE_LABEL = { quote: 'Devis entreprise', info: 'Information', partnership: 'Partenariat' } as const

export async function submitLead(_prev: SubmitState, form: FormData): Promise<SubmitState> {
  const values = readLead(form)
  // Honeypot: a filled hidden field means a bot. Pretend success, store nothing.
  if (String(form.get('website') ?? '').trim()) return { status: 'success' }

  const h = await headers()
  const ip = (h.get('x-forwarded-for') ?? '').split(',')[0].trim() || h.get('x-real-ip') || 'unknown'
  if (rateLimited(ip)) {
    return { status: 'error', message: 'Vous avez envoyé plusieurs demandes en peu de temps. Patientez quelques minutes, ou écrivez-nous sur WhatsApp.', values }
  }

  const errors = validateLead(values)
  if (Object.keys(errors).length) return { status: 'invalid', errors, values }

  const payload = await cms()
  let leadId: string | number
  try {
    const lead = await payload.create({
      collection: 'leads',
      overrideAccess: true,
      data: {
        status: 'new',
        type: values.type,
        name: values.name.trim(),
        company: values.company.trim() || undefined,
        jobTitle: values.jobTitle.trim() || undefined,
        phone: values.phone.trim() || undefined,
        email: values.email.trim() || undefined,
        topic: values.topic.trim() || undefined,
        participants: values.participants.trim() ? Number(values.participants) : undefined,
        message: values.message.trim(),
        tracking: { sourcePage: values.sourcePage || 'contact', consent: values.consent },
      },
    })
    leadId = lead.id
    payload.logger.info({ msg: 'Lead stored', leadId, type: values.type, sourcePage: values.sourcePage })
  } catch (error) {
    payload.logger.error({ err: error, msg: 'Lead storage failed' })
    return { status: 'error', message: 'Votre demande n’a pas pu être envoyée. Réessayez, ou écrivez-nous directement sur WhatsApp.', values }
  }

  // Notify the team. The lead is already saved: an e-mail failure is logged on the lead, never shown as a failure to the visitor.
  const settings = await payload.findGlobal({ slug: 'site-settings' })
  const recipients = (settings.notifyEmails || process.env.NOTIFY_EMAILS || '').split(',').map((s) => s.trim()).filter(Boolean)
  let notification: 'sent' | 'failed' | 'not_configured' = 'not_configured'
  let notificationError: string | undefined
  if (process.env.SMTP_HOST && recipients.length) {
    try {
      await payload.sendEmail({
        to: recipients,
        replyTo: values.email || undefined,
        subject: `Nouvelle demande (${TYPE_LABEL[values.type]}) — ${values.name}${values.company ? `, ${values.company}` : ''}`,
        text: [
          `Type : ${TYPE_LABEL[values.type]}`,
          `Nom : ${values.name}`,
          values.company ? `Organisme : ${values.company}` : null,
          values.jobTitle ? `Fonction : ${values.jobTitle}` : null,
          values.phone ? `Téléphone : ${values.phone}` : null,
          values.email ? `E-mail : ${values.email}` : null,
          values.topic ? `Sujet : ${values.topic}` : null,
          values.participants ? `Participants : ${values.participants}` : null,
          `Page d’origine : ${values.sourcePage || 'contact'}`,
          '',
          values.message,
          '',
          `Voir dans l’administration : ${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/admin/collections/leads/${leadId}`,
        ].filter((l) => l !== null).join('\n'),
      })
      notification = 'sent'
    } catch (error) {
      notification = 'failed'
      notificationError = (error as Error).message.slice(0, 200)
      payload.logger.error({ err: error, msg: 'Lead notification failed', leadId })
    }
  }
  await payload.update({
    collection: 'leads',
    id: leadId,
    overrideAccess: true,
    context: { skipAudit: true },
    data: { tracking: { sourcePage: values.sourcePage || 'contact', consent: values.consent, notification, notificationError } },
  })
  return { status: 'success' }
}
