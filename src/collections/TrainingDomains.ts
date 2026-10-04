import type { CollectionConfig } from 'payload'
import { isStaff, nobody, publishedOrStaff } from '../access'
import { orderField, publishedAtField, seoField, slugField, statusField } from '../fields/common'
import { auditAfterChange } from '../hooks/audit'
import { revalidateAfterChange } from '../hooks/revalidate'

export const TrainingDomains: CollectionConfig = {
  slug: 'training-domains',
  labels: { singular: 'Domaine de formation', plural: 'Domaines de formation' },
  admin: {
    useAsTitle: 'title',
    group: 'Formations',
    defaultColumns: ['order', 'title', 'status'],
    description: 'Les 11 grands domaines (Management, Ressources humaines…). Une page par domaine.',
  },
  defaultSort: 'order',
  access: { read: publishedOrStaff, create: isStaff, update: isStaff, delete: nobody },
  hooks: { afterChange: [auditAfterChange, revalidateAfterChange] },
  fields: [
    { name: 'title', label: 'Nom du domaine', type: 'text', required: true },
    { name: 'h1', label: 'Titre principal de la page', type: 'text', required: true },
    { name: 'summary', label: 'Phrase courte (carte de la liste)', type: 'text', required: true, maxLength: 110 },
    { name: 'intro', label: "Phrase d'accroche (haut de page)", type: 'textarea', required: true },
    {
      name: 'groups',
      label: 'Sous-groupes de formations, dans l’ordre',
      type: 'array',
      admin: { description: 'Ex. « Diriger une équipe », « Gérer des projets ».' },
      fields: [{ name: 'title', label: 'Nom du sous-groupe', type: 'text', required: true }],
    },
    { name: 'extra', label: 'Encadré complémentaire (facultatif)', type: 'richText' },
    {
      name: 'relatedCertificate',
      label: 'Certificat lié (facultatif)',
      type: 'relationship',
      relationTo: 'certificates',
    },
    { name: 'image', label: 'Photo', type: 'upload', relationTo: 'media' },
    slugField(),
    statusField,
    orderField,
    publishedAtField,
    seoField,
  ],
}
