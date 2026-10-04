import type { CollectionConfig } from 'payload'
import { isAdmin, nobody } from '../access'

export const AuditLogs: CollectionConfig = {
  slug: 'audit-logs',
  labels: { singular: 'Journal', plural: 'Journal des modifications' },
  admin: {
    useAsTitle: 'summary',
    group: 'Réglages',
    defaultColumns: ['createdAt', 'collectionSlug', 'action', 'summary', 'user'],
    description: 'Une ligne par document modifié, y compris lors des actions groupées. Lecture seule.',
  },
  defaultSort: '-createdAt',
  access: { read: isAdmin, create: nobody, update: nobody, delete: nobody },
  fields: [
    { name: 'collectionSlug', label: 'Type de contenu', type: 'text', required: true, index: true },
    { name: 'documentId', label: 'Document', type: 'text', required: true, index: true },
    { name: 'action', label: 'Action', type: 'text', required: true },
    { name: 'summary', label: 'Détail', type: 'text' },
    { name: 'user', label: 'Par', type: 'relationship', relationTo: 'users' },
  ],
}
