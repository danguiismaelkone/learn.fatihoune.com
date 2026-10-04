'use server'

import { headers } from 'next/headers'
import { cms } from '@/lib/cms'
import {
  CALLBACK_SLOT_LABELS,
  TRAINING_LOCATION_LABELS,
  readCallback,
  readLead,
  validateCallback,
  validateLead,
  type CallbackErrors,
  type CallbackInput,
  type CallbackSlot,
  type LeadErrors,
  type LeadInput,
  type TrainingLocation,
} from '@/lib/lead'

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

const TYPE_LABEL = { quote: 'Devis entreprise', info: 'Information', partnership: 'Partenariat', callback: 'Demande de rappel', advice: 'Besoin de conseil' } as const

type LeadData = {
  type: keyof typeof TYPE_LABEL
  name: string
  company?: string
  jobTitle?: string
  phone?: string
  email?: string
  topic?: string
  participants?: number
  trainingLocation?: TrainingLocation
  fdfpFunding?: boolean
  callbackSlot?: CallbackSlot
  message: string
  sourcePage: string
  consent: boolean
}

async function clientIp() {
  const h = await headers()
  return (h.get('x-forwarded-for') ?? '').split(',')[0].trim() || h.get('x-real-ip') || 'unknown'
}

/** Stores the lead, then notifies the team. Returns false only when storage failed. */
async function storeLead(data: LeadData): Promise<boolean> {
  const payload = await cms()
  const { sourcePage, consent, ...fields } = data
  let leadId: string | number
  try {
    const lead = await payload.create({
      collection: 'leads',
      overrideAccess: true,
      data: { status: 'new', ...fields, tracking: { sourcePage, consent } },
    })
    leadId = lead.id
    payload.logger.info({ msg: 'Lead stored', leadId, type: data.type, sourcePage })
  } catch (error) {
    payload.logger.error({ err: error, msg: 'Lead storage failed' })
    return false
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
        replyTo: data.email || undefined,
        subject: `Nouvelle demande (${TYPE_LABEL[data.type]}) — ${data.name}${data.company ? `, ${data.company}` : ''}`,
        text: [
          `Type : ${TYPE_LABEL[data.type]}`,
          `Nom : ${data.name}`,
          data.company ? `Organisme : ${data.company}` : null,
          data.jobTitle ? `Fonction : ${data.jobTitle}` : null,
          data.phone ? `Téléphone : ${data.phone}` : null,
          data.email ? `E-mail : ${data.email}` : null,
          data.callbackSlot ? `Rappel souhaité : ${CALLBACK_SLOT_LABELS[data.callbackSlot]}` : null,
          data.topic ? `Sujet : ${data.topic}` : null,
          data.participants ? `Participants : ${data.participants}` : null,
          data.trainingLocation ? `Lieu souhaité : ${TRAINING_LOCATION_LABELS[data.trainingLocation]}` : null,
          data.fdfpFunding ? 'Financement FDFP envisagé : oui' : null,
          `Page d’origine : ${sourcePage}`,
          '',
          data.message,
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
  // Acknowledge receipt to the visitor. Deliberately generic: the form must not become a relay that
  // sends arbitrary visitor-typed text (message, topic) to any address typed in the e-mail field.
  let confirmation: 'sent' | 'failed' | 'not_configured' | 'no_email' = data.email ? 'not_configured' : 'no_email'
  let confirmationError: string | undefined
  if (process.env.SMTP_HOST && data.email) {
    const contact = [
      settings.phone ? `Téléphone : ${settings.phone}` : null,
      settings.whatsappDisplay ? `WhatsApp : ${settings.whatsappDisplay}` : null,
      settings.email ? `E-mail : ${settings.email}` : null,
    ].filter((l) => l !== null)
    try {
      await payload.sendEmail({
        to: data.email,
        replyTo: settings.email || recipients[0] || undefined,
        subject: 'Nous avons bien reçu votre demande — FATIHOUNE Formation',
        text: [
          `Bonjour ${data.name.slice(0, 80)},`,
          '',
          `Nous avons bien reçu votre demande (${TYPE_LABEL[data.type].toLowerCase()}) envoyée depuis notre site.`,
          `Notre équipe vous recontacte ${settings.responseDelay || 'rapidement'}.`,
          '',
          ...(contact.length ? ['Pour toute question d’ici là, vous pouvez répondre à cet e-mail ou nous joindre :', ...contact, ''] : []),
          'L’équipe FATIHOUNE Formation',
          process.env.NEXT_PUBLIC_SITE_URL ?? '',
          '',
          'Vous recevez cet e-mail parce que votre adresse a été saisie dans le formulaire de contact de notre site.',
          'Si vous n’êtes pas à l’origine de cette demande, ignorez simplement ce message.',
        ].join('\n'),
      })
      confirmation = 'sent'
    } catch (error) {
      confirmation = 'failed'
      confirmationError = (error as Error).message.slice(0, 200)
      payload.logger.error({ err: error, msg: 'Lead confirmation failed', leadId })
    }
  }
  await payload.update({
    collection: 'leads',
    id: leadId,
    overrideAccess: true,
    context: { skipAudit: true },
    data: { tracking: { sourcePage, consent, notification, notificationError, confirmation, confirmationError } },
  })
  return true
}

const RATE_LIMIT_MESSAGE = 'Vous avez envoyé plusieurs demandes en peu de temps. Patientez quelques minutes, ou écrivez-nous sur WhatsApp.'
const STORAGE_ERROR = 'Votre demande n’a pas pu être envoyée. Réessayez, ou écrivez-nous directement sur WhatsApp.'

export async function submitLead(_prev: SubmitState, form: FormData): Promise<SubmitState> {
  const values = readLead(form)
  // Honeypot: a filled hidden field means a bot. Pretend success, store nothing.
  if (String(form.get('website') ?? '').trim()) return { status: 'success' }
  if (rateLimited(await clientIp())) return { status: 'error', message: RATE_LIMIT_MESSAGE, values }

  const errors = validateLead(values)
  if (Object.keys(errors).length) return { status: 'invalid', errors, values }

  const stored = await storeLead({
    type: values.type,
    name: values.name.trim(),
    company: values.company.trim() || undefined,
    jobTitle: values.jobTitle.trim() || undefined,
    phone: values.phone.trim() || undefined,
    email: values.email.trim() || undefined,
    topic: values.topic.trim() || undefined,
    participants: values.participants.trim() ? Number(values.participants) : undefined,
    // Location and FDFP only qualify quote requests.
    trainingLocation: values.type === 'quote' && values.location ? (values.location as TrainingLocation) : undefined,
    fdfpFunding: values.type === 'quote' ? values.fdfp : undefined,
    message: values.message.trim(),
    sourcePage: values.sourcePage || 'contact',
    consent: values.consent,
  })
  return stored ? { status: 'success' } : { status: 'error', message: STORAGE_ERROR, values }
}

export type CallbackState =
  | { status: 'idle' }
  | { status: 'invalid'; errors: CallbackErrors; values: CallbackInput }
  | { status: 'error'; message: string; values: CallbackInput }
  | { status: 'success' }

export async function submitCallback(_prev: CallbackState, form: FormData): Promise<CallbackState> {
  const values = readCallback(form)
  if (String(form.get('website') ?? '').trim()) return { status: 'success' }
  if (rateLimited(await clientIp())) return { status: 'error', message: RATE_LIMIT_MESSAGE, values }

  const errors = validateCallback(values)
  if (Object.keys(errors).length) return { status: 'invalid', errors, values }

  const topic = values.topic.trim() || undefined
  const stored = await storeLead({
    type: 'callback',
    name: values.name.trim(),
    phone: values.phone.trim(),
    callbackSlot: values.slot,
    topic,
    // The collection requires a message: a callback request carries a generated one.
    message: `Demande de rappel. Moment souhaité : ${CALLBACK_SLOT_LABELS[values.slot].toLowerCase()}.${topic ? ` Sujet : ${topic}.` : ''}`,
    sourcePage: values.sourcePage || 'inconnue',
    consent: values.consent,
  })
  return stored ? { status: 'success' } : { status: 'error', message: STORAGE_ERROR, values }
}
