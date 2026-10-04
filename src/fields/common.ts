import type { Field } from 'payload'

export const slugField = (from = 'title'): Field => ({
  name: 'slug',
  label: 'Adresse de la page (slug)',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description:
      "Partie de l'adresse web, en minuscules et sans accents (ex. ressources-humaines). Ne la modifiez pas après publication.",
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        const source = (value as string | undefined) || (data?.[from] as string | undefined) || ''
        return source
          .normalize('NFD')
          .replace(/[̀-ͯ]/g, '')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
      },
    ],
  },
})

export const statusField: Field = {
  name: 'status',
  label: 'Statut',
  type: 'select',
  required: true,
  defaultValue: 'draft',
  index: true,
  options: [
    { label: 'Brouillon (invisible)', value: 'draft' },
    { label: 'Publié', value: 'published' },
  ],
  admin: { position: 'sidebar' },
}

export const orderField: Field = {
  name: 'order',
  label: "Ordre d'affichage",
  type: 'number',
  defaultValue: 100,
  admin: { position: 'sidebar', description: 'Plus petit = plus haut.' },
}

export const seoField: Field = {
  name: 'seo',
  label: 'Référencement Google',
  type: 'group',
  fields: [
    {
      name: 'title',
      label: 'Titre affiché dans Google',
      type: 'text',
      maxLength: 65,
      admin: { description: '50 à 60 caractères.' },
    },
    {
      name: 'description',
      label: 'Description affichée dans Google',
      type: 'textarea',
      maxLength: 170,
      admin: { description: '140 à 160 caractères.' },
    },
  ],
}

export const publishedAtField: Field = {
  name: 'publishedAt',
  label: 'Publié le',
  type: 'date',
  admin: { position: 'sidebar', readOnly: true },
  hooks: {
    beforeChange: [
      ({ value, siblingData }) =>
        siblingData?.status === 'published' && !value ? new Date().toISOString() : value,
    ],
  },
}
