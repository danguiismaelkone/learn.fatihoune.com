import type { CollectionConfig } from 'payload'
import { isStaff, nobody } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Image ou document', plural: 'Images et documents' },
  admin: { group: 'Contenus' },
  access: { read: () => true, create: isStaff, update: isStaff, delete: nobody },
  fields: [
    {
      name: 'alt',
      label: "Description de l'image (pour les personnes malvoyantes et Google)",
      type: 'text',
      required: true,
      admin: { description: 'Ex. « Formateur FATIHOUNE animant une session devant un groupe ».' },
    },
    {
      name: 'credit',
      label: 'Crédit photo',
      type: 'group',
      admin: { description: 'Obligatoire pour une image qui ne vous appartient pas (banque d’images, photographe).' },
      fields: [
        { name: 'author', label: 'Auteur', type: 'text' },
        { name: 'source', label: 'Source', type: 'select', options: [
          { label: 'Photo FATIHOUNE', value: 'own' },
          { label: 'Unsplash (licence Unsplash, usage commercial gratuit)', value: 'unsplash' },
          { label: 'Autre', value: 'other' },
        ] },
        { name: 'url', label: 'Lien vers la photo d’origine', type: 'text' },
      ],
    },
    {
      name: 'consent',
      label: 'Les personnes reconnaissables ont donné leur accord',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
  upload: {
    staticDir: process.env.MEDIA_DIR || 'media',
    mimeTypes: ['image/*', 'application/pdf'],
    imageSizes: [
      { name: 'card', width: 800, height: 600, position: 'centre' },
      { name: 'wide', width: 1600 },
    ],
  },
}
