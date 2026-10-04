import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminField, hasRole } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Utilisateur', plural: 'Utilisateurs' },
  admin: { useAsTitle: 'email', group: 'Réglages', defaultColumns: ['name', 'email', 'roles'] },
  auth: true,
  access: {
    read: ({ req }) => (hasRole(req, 'admin') ? true : { id: { equals: req.user?.id } }),
    create: isAdmin,
    update: ({ req }) => (hasRole(req, 'admin') ? true : { id: { equals: req.user?.id } }),
    delete: isAdmin,
  },
  fields: [
    { name: 'name', label: 'Nom', type: 'text' },
    {
      name: 'roles',
      label: 'Rôle',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['editor'],
      access: { update: isAdminField },
      options: [
        { label: 'Administrateur (réglages et comptes)', value: 'admin' },
        { label: 'Éditeur (contenus et demandes)', value: 'editor' },
      ],
    },
  ],
}
