import type { CollectionConfig, FieldHook } from 'payload'
import { isStaff, nobody, publishedOrStaff } from '../access'
import { orderField, statusField } from '../fields/common'
import { auditAfterChange } from '../hooks/audit'
import { revalidateAfterChange } from '../hooks/revalidate'
import { TRAINING_BADGES, TRAINING_BADGE_LABELS, slugify } from '../lib/training'

/** Slug from the title when empty; suffixed (-2, -3…) if another training already uses it. */
const uniqueSlug: FieldHook = async ({ value, data, originalDoc, req }) => {
  // On update, `data` may hold only the changed fields: fall back to the stored title.
  const source = (value as string | undefined)?.trim() || (data?.title as string | undefined) || (originalDoc?.title as string | undefined) || ''
  const base = slugify(source)
  if (!base) return value
  let candidate = base
  for (let n = 2; n < 50; n++) {
    const { docs } = await req.payload.find({
      collection: 'trainings',
      where: { slug: { equals: candidate } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
      req,
    })
    if (!docs.length || docs[0].id === originalDoc?.id) return candidate
    candidate = `${base}-${n}`
  }
  return candidate
}

const DETAIL_REQUIRED = ['audience', 'objectives', 'program'] as const

export const Trainings: CollectionConfig = {
  slug: 'trainings',
  labels: { singular: 'Formation', plural: 'Formations' },
  admin: {
    useAsTitle: 'title',
    group: 'Formations',
    defaultColumns: ['title', 'domain', 'group', 'durationLabel', 'detailPublished', 'status'],
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
    {
      name: 'image',
      label: 'Photo',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Facultatif. Utilisée sur la carte de l’accueil et sur la fiche ; à défaut, la photo du domaine.' },
    },
    {
      name: 'badges',
      label: 'Étiquettes',
      type: 'select',
      hasMany: true,
      options: TRAINING_BADGES.map((value) => ({ value, label: TRAINING_BADGE_LABELS[value] })),
      admin: { description: 'Affichées à côté de l’intitulé dans la page du domaine. Facultatif.' },
    },
    {
      name: 'slug',
      label: 'Adresse de la fiche (slug)',
      type: 'text',
      unique: true,
      index: true,
      hooks: { beforeValidate: [uniqueSlug] },
      admin: {
        position: 'sidebar',
        description: 'Créée automatiquement à partir de l’intitulé. Ne la modifiez pas après publication de la fiche.',
      },
    },
    {
      name: 'detailPublished',
      label: 'Publier la fiche détaillée',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Ouvre la page /formations/<domaine>/<fiche>. Exige public visé, objectifs et programme relus.',
      },
      validate: (value: boolean | null | undefined, { siblingData }: { siblingData: Record<string, unknown> }) => {
        if (!value) return true
        const missing = DETAIL_REQUIRED.filter((k) => {
          const v = siblingData?.[k]
          return !v || (typeof v === 'string' && !v.trim())
        })
        return missing.length
          ? 'Avant de publier la fiche, remplissez : public visé, objectifs et programme.'
          : true
      },
    },
    {
      type: 'collapsible',
      label: 'Fiche détaillée',
      admin: { initCollapsed: false, description: 'Contenu de la page de la formation. Rien n’est visible tant que « Publier la fiche détaillée » n’est pas coché.' },
      fields: [
        { name: 'audience', label: 'Public visé', type: 'textarea' },
        { name: 'prerequisites', label: 'Prérequis', type: 'textarea', admin: { description: 'Laisser vide s’il n’y en a pas : la fiche affichera « Aucun prérequis ».' } },
        { name: 'objectives', label: 'Objectifs', type: 'richText' },
        { name: 'program', label: 'Programme', type: 'richText' },
        { name: 'draftNote', label: 'Note de relecture (interne, jamais affichée)', type: 'textarea' },
      ],
    },
    statusField,
    orderField,
  ],
}
