import type { GlobalConfig } from 'payload'
import { isAdmin, isStaff } from '../access'
import { revalidateGlobal } from '../hooks/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Réglages du site',
  admin: { group: 'Réglages' },
  access: { read: () => true, update: isStaff },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    { type: 'tabs', tabs: [
      { label: 'Coordonnées', fields: [
        { name: 'phone', label: 'Téléphone', type: 'text', required: true },
        { name: 'whatsapp', label: 'Numéro WhatsApp (format international, chiffres seuls)', type: 'text', required: true, admin: { description: 'Ex. 2250103123266' } },
        { name: 'whatsappDisplay', label: 'WhatsApp affiché', type: 'text', required: true },
        { name: 'email', label: 'E-mail affiché', type: 'email', required: true },
        { name: 'address', label: 'Adresse', type: 'textarea', required: true },
        { name: 'hours', label: 'Horaires', type: 'text' },
        { name: 'responseDelay', label: 'Délai de réponse promis (facultatif)', type: 'text', admin: { description: 'Ex. « sous 48 h ouvrées ». Laisser vide tant qu’il n’est pas garanti.' } },
        { name: 'socials', label: 'Réseaux sociaux (pied de page)', type: 'array', admin: { description: 'Uniquement les comptes actifs. Rien ne s’affiche tant que la liste est vide.' }, fields: [
          { name: 'network', label: 'Réseau', type: 'select', required: true, options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'TikTok', value: 'tiktok' },
            { label: 'X', value: 'x' },
          ] },
          { name: 'url', label: 'Adresse de la page', type: 'text', required: true, validate: (v: unknown) => (typeof v === 'string' && /^https:\/\//.test(v) ? true : 'L’adresse doit commencer par https://') },
        ] },
      ] },
      { label: 'Preuves', fields: [
        { name: 'accreditations', label: 'Agréments', type: 'array', fields: [
          { name: 'name', label: 'Nom court (bandeau)', type: 'text', required: true },
          { name: 'fullName', label: 'Nom complet', type: 'text', required: true },
          { name: 'detail', label: 'Précision', type: 'text' },
          { name: 'validUntil', label: 'Valable jusqu’au (rappel interne, non affiché)', type: 'date' },
        ] },
        { name: 'keyFigures', label: 'Chiffres clés', type: 'array', fields: [
          { name: 'value', label: 'Chiffre', type: 'text', required: true },
          { name: 'label', label: 'Libellé', type: 'text', required: true },
          { name: 'source', label: 'Source (interne, obligatoire)', type: 'text', required: true },
        ] },
      ] },
      { label: 'Documents', fields: [
        { name: 'catalogPdf', label: 'Catalogue des formations (PDF)', type: 'upload', relationTo: 'media' },
        { name: 'presentationPdf', label: 'Présentation de FATIHOUNE (PDF)', type: 'upload', relationTo: 'media' },
      ] },
      { label: 'Notifications', fields: [
        { name: 'notifyEmails', label: 'Adresses qui reçoivent les nouvelles demandes', type: 'text', access: { update: ({ req }) => Boolean(isAdmin({ req })) }, admin: { description: 'Séparées par des virgules.' } },
      ] },
    ] },
  ],
}
