import type { CollectionConfig } from 'payload'
import { isStaff, nobody } from '../access'
import { orderField } from '../fields/common'
import { auditAfterChange } from '../hooks/audit'
import { revalidateAfterChange } from '../hooks/revalidate'

export const References: CollectionConfig = {
  slug: 'references',
  labels: { singular: 'Référence client', plural: 'Références clients' },
  admin: {
    useAsTitle: 'name',
    group: 'Références',
    defaultColumns: ['name', 'category', 'city', 'canBeCited'],
    description:
      'Seuls les clients avec « Peut être cité » coché apparaissent sur le site. Pour en autoriser plusieurs : cochez-les, puis « Modifier ».',
  },
  defaultSort: 'order',
  access: {
    read: ({ req }) => (req.user ? true : { canBeCited: { equals: true } }),
    create: isStaff,
    update: isStaff,
    delete: nobody,
  },
  hooks: { afterChange: [auditAfterChange, revalidateAfterChange] },
  fields: [
    { name: 'name', label: 'Nom', type: 'text', required: true },
    { name: 'city', label: 'Ville', type: 'text' },
    {
      name: 'category',
      label: 'Catégorie',
      type: 'select',
      required: true,
      options: [
        { label: 'Ministères et services de l’État', value: 'ministry' },
        { label: 'Agences et institutions', value: 'agency' },
        { label: 'Collectivités', value: 'local' },
        { label: 'Partenaires internationaux et réseaux', value: 'international' },
        { label: 'Associations et coopératives', value: 'association' },
      ],
    },
    { name: 'logo', label: 'Logo', type: 'upload', relationTo: 'media' },
    {
      name: 'canBeCited',
      label: 'Peut être cité sur le site',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'isProgramPartner',
      label: 'Afficher aussi parmi les partenaires de la page Programmes',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'proofDocument',
      label: 'Attestation de bonne exécution (jamais publiée)',
      type: 'upload',
      relationTo: 'media',
      access: { read: ({ req }) => Boolean(req.user) },
    },
    orderField,
  ],
}
