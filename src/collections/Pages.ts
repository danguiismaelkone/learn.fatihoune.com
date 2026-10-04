import type { CollectionConfig } from 'payload'
import { isStaff, nobody, publishedOrStaff } from '../access'
import { publishedAtField, seoField, statusField } from '../fields/common'
import { auditAfterChange } from '../hooks/audit'
import { revalidateAfterChange } from '../hooks/revalidate'
import { pageBlocks } from '../blocks'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Page', plural: 'Pages de contenu' },
  admin: {
    useAsTitle: 'title',
    group: 'Contenus',
    defaultColumns: ['title', 'path', 'status', 'updatedAt'],
    description: 'Digitalisation, Programmes, Financement FDFP, Qui sommes-nous, pages légales…',
    preview: (doc) => `/${String(doc?.path ?? '')}?preview=1`,
  },
  versions: { drafts: false, maxPerDoc: 20 },
  access: { read: publishedOrStaff, create: isStaff, update: isStaff, delete: nobody },
  hooks: { afterChange: [auditAfterChange, revalidateAfterChange] },
  fields: [
    { name: 'title', label: 'Nom de la page (menu, fil d’Ariane)', type: 'text', required: true },
    {
      name: 'path',
      label: 'Adresse',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'Ex. digitalisation, programmes/entrepreneuriat. Ne pas modifier après publication.' },
    },
    {
      name: 'parentLabel',
      label: 'Rubrique parente (fil d’Ariane)',
      type: 'select',
      options: [
        { label: 'Programmes', value: 'programmes' },
        { label: 'Solutions', value: 'solutions' },
        { label: 'Vous êtes', value: 'vous-etes' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'layout', label: 'Contenu de la page', type: 'blocks', blocks: pageBlocks, required: true },
    {
      name: 'stickyCta',
      label: 'Barre d’action mobile',
      type: 'select',
      defaultValue: 'quote',
      options: [
        { label: 'Demander un devis', value: 'quote' },
        { label: 'Demander des informations', value: 'info' },
        { label: 'Proposer un partenariat', value: 'partnership' },
        { label: 'Aucune', value: 'none' },
      ],
      admin: { position: 'sidebar' },
    },
    statusField,
    publishedAtField,
    seoField,
  ],
}
