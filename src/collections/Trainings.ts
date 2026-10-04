import type { CollectionConfig } from 'payload'
import { isStaff, nobody, publishedOrStaff } from '../access'
import { orderField, statusField } from '../fields/common'
import { auditAfterChange } from '../hooks/audit'
import { revalidateAfterChange } from '../hooks/revalidate'

export const Trainings: CollectionConfig = {
  slug: 'trainings',
  labels: { singular: 'Formation', plural: 'Formations' },
  admin: {
    useAsTitle: 'title',
    group: 'Formations',
    defaultColumns: ['title', 'domain', 'group', 'durationLabel', 'status'],
    listSearchableFields: ['title'],
    description:
      'Une ligne par formation. Pour publier ou dépublier plusieurs formations d’un coup : cochez-les, puis « Modifier ».',
  },
  defaultSort: 'order',
  access: { read: publishedOrStaff, create: isStaff, update: isStaff, delete: nobody },
  hooks: { afterChange: [auditAfterChange, revalidateAfterChange] },
  fields: [
    { name: 'title', label: 'Intitulé', type: 'text', required: true },
    {
      name: 'domain',
      label: 'Domaine',
      type: 'relationship',
      relationTo: 'training-domains',
      required: true,
      index: true,
    },
    {
      name: 'group',
      label: 'Sous-groupe',
      type: 'text',
      admin: { description: 'Doit correspondre exactement à un sous-groupe du domaine.' },
    },
    {
      type: 'row',
      fields: [
        { name: 'durationHours', label: 'Durée en heures', type: 'number', min: 0 },
        {
          name: 'durationLabel',
          label: 'Durée affichée',
          type: 'text',
          admin: { description: 'Ex. « 30 h », « 5 jours ». Laisser vide si inconnue : rien ne s’affiche.' },
        },
      ],
    },
    { name: 'audience', label: 'Public visé', type: 'text' },
    { name: 'objectives', label: 'Objectifs (fiche détaillée, plus tard)', type: 'richText' },
    statusField,
    orderField,
  ],
}
