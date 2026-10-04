import type { CollectionConfig, PayloadHandler } from 'payload'
import { hasRole, isStaff, nobody } from '../access'
import { writeAudit, auditAfterChange } from '../hooks/audit'

export const LEAD_STATUSES = ['new', 'in_progress', 'done', 'archived'] as const
export type LeadStatus = (typeof LEAD_STATUSES)[number]

/** Which current statuses may move to each target status. Rows outside these are skipped, never forced. */
const ALLOWED_FROM: Record<Exclude<LeadStatus, 'new'>, LeadStatus[]> = {
  in_progress: ['new'],
  done: ['new', 'in_progress'],
  archived: ['new', 'in_progress', 'done'],
}

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'Nouvelle',
  in_progress: 'En cours',
  done: 'Traitée',
  archived: 'Archivée',
}

const parseIds = (raw: unknown): string[] =>
  Array.isArray(raw) ? [...new Set(raw.map(String).filter(Boolean))].slice(0, 500) : []

const bulkStatus: PayloadHandler = async (req) => {
  // Same permission as the single-row edit.
  if (!hasRole(req, 'admin', 'editor')) {
    return Response.json({ error: 'Action non autorisée.' }, { status: 403 })
  }
  const body = (await req.json?.()) as { ids?: unknown; status?: unknown } | undefined
  const ids = parseIds(body?.ids)
  const target = body?.status as Exclude<LeadStatus, 'new'>
  if (!ids.length || !(target in ALLOWED_FROM)) {
    return Response.json({ error: 'Sélection ou statut invalide.' }, { status: 400 })
  }

  let updated = 0
  const skipped: { id: string; reason: string }[] = []
  for (const id of ids) {
    // Revalidate every selected row server-side.
    const lead = await req.payload
      .findByID({ collection: 'leads', id, req, overrideAccess: false, depth: 0 })
      .catch(() => null)
    if (!lead) {
      skipped.push({ id, reason: 'introuvable' })
      continue
    }
    const current = lead.status as LeadStatus
    if (!ALLOWED_FROM[target].includes(current)) {
      skipped.push({ id, reason: `déjà « ${STATUS_LABELS[current]} »` })
      continue
    }
    await req.payload.update({
      collection: 'leads',
      id,
      data: { status: target },
      req,
      overrideAccess: false,
      context: { skipAudit: true },
    })
    await writeAudit({
      req,
      collection: 'leads',
      documentId: id,
      action: 'bulk-status',
      summary: `${STATUS_LABELS[current]} → ${STATUS_LABELS[target]}`,
    })
    updated++
  }
  return Response.json({ updated, skipped: skipped.length, details: skipped })
}

const csvCell = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`

const exportCsv: PayloadHandler = async (req) => {
  if (!hasRole(req, 'admin', 'editor')) {
    return Response.json({ error: 'Action non autorisée.' }, { status: 403 })
  }
  const ids = parseIds(new URL(req.url ?? '', 'http://x').searchParams.get('ids')?.split(','))
  if (!ids.length) return Response.json({ error: 'Aucune demande sélectionnée.' }, { status: 400 })
  const { docs } = await req.payload.find({
    collection: 'leads',
    where: { id: { in: ids } },
    limit: 500,
    depth: 0,
    req,
    overrideAccess: false,
  })
  const header = ['Date', 'Type', 'Statut', 'Nom', 'Organisme', 'Fonction', 'Téléphone', 'E-mail', 'Sujet', 'Participants', 'Message', 'Page d’origine']
  const rows = docs.map((d) =>
    [d.createdAt, d.type, STATUS_LABELS[d.status as LeadStatus], d.name, d.company, d.jobTitle, d.phone, d.email, d.topic, d.participants, d.message, d.tracking?.sourcePage]
      .map(csvCell)
      .join(';'),
  )
  for (const d of docs) {
    await writeAudit({ req, collection: 'leads', documentId: d.id, action: 'export', summary: 'export CSV' })
  }
  const skipped = ids.length - docs.length
  return new Response('﻿' + [header.map(csvCell).join(';'), ...rows].join('\r\n'), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="demandes-fatihoune-${new Date().toISOString().slice(0, 10)}.csv"`,
      'X-Exported': String(docs.length),
      'X-Skipped': String(skipped),
    },
  })
}

export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: { singular: 'Demande', plural: 'Demandes reçues' },
  admin: {
    useAsTitle: 'name',
    group: 'Demandes',
    defaultColumns: ['createdAt', 'type', 'name', 'company', 'topic', 'status'],
    listSearchableFields: ['name', 'company', 'email', 'phone', 'topic'],
    description:
      'Toutes les demandes envoyées depuis le site. Cochez plusieurs lignes pour les marquer en cours, traitées, les archiver ou les exporter.',
    components: { beforeListTable: ['/components/admin/LeadBulkActions#LeadBulkActions'] },
  },
  defaultSort: '-createdAt',
  access: {
    // Only the website's server action creates leads (with overrideAccess).
    create: nobody,
    read: isStaff,
    update: isStaff,
    delete: nobody,
  },
  hooks: {
    afterChange: [
      async (args) => (args.context?.skipAudit ? args.doc : auditAfterChange(args)),
    ],
  },
  endpoints: [
    { path: '/bulk-status', method: 'post', handler: bulkStatus },
    { path: '/export', method: 'get', handler: exportCsv },
  ],
  fields: [
    {
      name: 'status',
      label: 'Statut',
      type: 'select',
      required: true,
      defaultValue: 'new',
      index: true,
      options: LEAD_STATUSES.map((value) => ({ value, label: STATUS_LABELS[value] })),
      admin: { position: 'sidebar' },
    },
    {
      name: 'type',
      label: 'Type de demande',
      type: 'select',
      required: true,
      options: [
        { label: 'Devis entreprise', value: 'quote' },
        { label: 'Information', value: 'info' },
        { label: 'Partenariat', value: 'partnership' },
      ],
    },
    { name: 'name', label: 'Nom et prénom', type: 'text', required: true },
    { type: 'row', fields: [
      { name: 'company', label: 'Entreprise ou organisme', type: 'text' },
      { name: 'jobTitle', label: 'Fonction', type: 'text' },
    ] },
    { type: 'row', fields: [
      { name: 'phone', label: 'Téléphone', type: 'text' },
      { name: 'email', label: 'E-mail', type: 'email' },
    ] },
    { type: 'row', fields: [
      { name: 'topic', label: 'Formation ou sujet', type: 'text' },
      { name: 'participants', label: 'Nombre de participants', type: 'number' },
    ] },
    { name: 'message', label: 'Message', type: 'textarea', required: true },
    { name: 'internalNote', label: 'Note interne (jamais envoyée au client)', type: 'textarea' },
    {
      name: 'tracking',
      label: 'Suivi technique',
      type: 'group',
      admin: { readOnly: true },
      fields: [
        { name: 'sourcePage', label: 'Page d’origine', type: 'text' },
        { name: 'consent', label: 'Consentement donné', type: 'checkbox' },
        { name: 'notification', label: 'Notification e-mail', type: 'select', options: [
          { label: 'Envoyée', value: 'sent' },
          { label: 'Échec', value: 'failed' },
          { label: 'Non configurée', value: 'not_configured' },
        ] },
        { name: 'notificationError', label: 'Erreur', type: 'text' },
      ],
    },
  ],
}
