import type { CollectionAfterChangeHook, PayloadRequest } from 'payload'

type AuditInput = {
  req: PayloadRequest
  collection: string
  documentId: string | number
  action: string
  summary?: string
}

/** Writes one audit entry. Never throws: an audit failure must not block the editor. */
export async function writeAudit({ req, collection, documentId, action, summary }: AuditInput) {
  try {
    await req.payload.create({
      collection: 'audit-logs',
      data: {
        collectionSlug: collection,
        documentId: String(documentId),
        action,
        summary,
        user: req.user?.id ?? undefined,
      },
      req,
      overrideAccess: true,
    })
  } catch (error) {
    req.payload.logger.error({ err: error, msg: 'Audit log write failed' })
  }
}

/** One audit entry per changed document — covers single edits and Payload's bulk edit alike. */
export const auditAfterChange: CollectionAfterChangeHook = async ({ doc, previousDoc, operation, req, collection }) => {
  if (!req.user) return doc
  const changed =
    operation === 'create'
      ? 'création'
      : Object.keys(doc)
          .filter((key) => !['updatedAt', 'createdAt'].includes(key))
          .filter((key) => JSON.stringify(doc[key]) !== JSON.stringify(previousDoc?.[key]))
          .join(', ')
  await writeAudit({
    req,
    collection: collection.slug,
    documentId: doc.id,
    action: operation === 'create' ? 'create' : 'update',
    summary: changed || 'aucun champ modifié',
  })
  return doc
}
