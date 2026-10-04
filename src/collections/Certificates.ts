import type { CollectionConfig } from 'payload'
import { isStaff, nobody, publishedOrStaff } from '../access'
import { orderField, statusField } from '../fields/common'
import { auditAfterChange } from '../hooks/audit'
import { revalidateAfterChange } from '../hooks/revalidate'

export const Certificates: CollectionConfig = {
  slug: 'certificates',
  labels: { singular: 'Certificat', plural: 'Certificats de spécialisation' },
  admin: { useAsTitle: 'title', group: 'Formations', defaultColumns: ['code', 'title', 'durationHours', 'status'] },
  defaultSort: 'order',
  access: { read: publishedOrStaff, create: isStaff, update: isStaff, delete: nobody },
  hooks: { afterChange: [auditAfterChange, revalidateAfterChange] },
  fields: [
    { name: 'code', label: 'Code', type: 'text', required: true, admin: { description: 'Ex. CS1-GRH' } },
    { name: 'title', label: 'Intitulé complet', type: 'text', required: true },
    { name: 'shortTitle', label: 'Discipline (court)', type: 'text', required: true },
    { name: 'durationHours', label: 'Durée en heures', type: 'number', required: true },
    statusField,
    orderField,
  ],
}
