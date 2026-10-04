import type { Block, Field } from 'payload'

const ctaFields: Field[] = [
  { name: 'label', label: 'Texte du bouton', type: 'text', required: true },
  {
    name: 'kind',
    label: 'Action',
    type: 'select',
    required: true,
    defaultValue: 'quote',
    options: [
      { label: 'Formulaire — devis', value: 'quote' },
      { label: 'Formulaire — information', value: 'info' },
      { label: 'Formulaire — partenariat', value: 'partnership' },
      { label: 'WhatsApp', value: 'whatsapp' },
      { label: 'Lien vers une page du site', value: 'link' },
    ],
  },
  {
    name: 'href',
    label: 'Adresse (si lien)',
    type: 'text',
    admin: { condition: (_, sibling) => sibling?.kind === 'link', description: 'Ex. /financement-fdfp' },
  },
  { name: 'topic', label: 'Sujet pré-rempli dans le formulaire', type: 'text' },
]

export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'En-tête de page', plural: 'En-têtes de page' },
  fields: [
    { name: 'eyebrow', label: 'Surtitre (petites capitales)', type: 'text' },
    { name: 'title', label: 'Titre principal (H1)', type: 'text', required: true },
    { name: 'lead', label: 'Accroche', type: 'textarea', required: true },
    { name: 'buttons', label: 'Boutons', type: 'array', maxRows: 2, fields: ctaFields },
    { name: 'showProof', label: 'Afficher les agréments sous les boutons', type: 'checkbox', defaultValue: false },
    {
      name: 'variant',
      label: 'Présentation',
      type: 'select',
      defaultValue: 'split',
      options: [
        { label: 'Texte à gauche, photo à droite', value: 'split' },
        { label: 'Photo pleine largeur, texte blanc par-dessus', value: 'fullbleed' },
      ],
    },
    { name: 'showSearch', label: 'Afficher la recherche de formations', type: 'checkbox', defaultValue: false },
    { name: 'image', label: 'Photo (ordinateur, à droite)', type: 'upload', relationTo: 'media' },
    { name: 'withPhotoSlot', label: 'Réserver un emplacement photo', type: 'checkbox', defaultValue: false },
  ],
}

export const DomainIndexBlock: Block = {
  slug: 'domainIndex',
  labels: { singular: 'Index des domaines', plural: 'Index des domaines' },
  fields: [{ name: 'title', label: 'Intertitre (H2)', type: 'text', required: true }],
}

export const ReferencesBlock: Block = {
  slug: 'referencesTeaser',
  labels: { singular: 'Aperçu des références', plural: 'Aperçus des références' },
  fields: [
    { name: 'title', label: 'Intertitre (H2)', type: 'text', required: true },
    { name: 'intro', label: 'Phrase', type: 'textarea' },
    { name: 'showStats', label: 'Afficher les chiffres clés', type: 'checkbox', defaultValue: true },
  ],
}

export const TextBlock: Block = {
  slug: 'text',
  labels: { singular: 'Texte', plural: 'Textes' },
  fields: [
    { name: 'anchor', label: 'Ancre (facultatif)', type: 'text', admin: { description: 'Ex. femmes → lien /programmes#femmes' } },
    { name: 'title', label: 'Intertitre (H2)', type: 'text' },
    { name: 'body', label: 'Texte', type: 'richText' },
    { name: 'tone', label: 'Fond', type: 'select', defaultValue: 'paper', options: [
      { label: 'Normal', value: 'paper' }, { label: 'Blanc avec filet rouge', value: 'white' }, { label: 'Encadré pêche', value: 'callout' },
    ] },
  ],
}

export const StepsBlock: Block = {
  slug: 'steps',
  labels: { singular: 'Étapes numérotées', plural: 'Étapes numérotées' },
  fields: [
    { name: 'title', label: 'Intertitre (H2)', type: 'text', required: true },
    { name: 'items', label: 'Étapes', type: 'array', minRows: 2, fields: [
      { name: 'title', label: 'Titre de l’étape', type: 'text', required: true },
      { name: 'body', label: 'Explication', type: 'textarea' },
    ] },
  ],
}

export const ListBlock: Block = {
  slug: 'list',
  labels: { singular: 'Liste à puces', plural: 'Listes à puces' },
  fields: [
    { name: 'title', label: 'Intertitre (H2)', type: 'text', required: true },
    { name: 'intro', label: 'Introduction', type: 'textarea' },
    { name: 'items', label: 'Éléments', type: 'array', fields: [
      { name: 'strong', label: 'Début en gras (facultatif)', type: 'text' },
      { name: 'text', label: 'Texte', type: 'text', required: true },
    ] },
  ],
}

export const StatsBlock: Block = {
  slug: 'stats',
  labels: { singular: 'Chiffres clés', plural: 'Chiffres clés' },
  fields: [
    { name: 'title', label: 'Intertitre (facultatif)', type: 'text' },
    { name: 'info', label: 'Les chiffres viennent de Réglages du site › Chiffres clés', type: 'checkbox', defaultValue: true, admin: { readOnly: true } },
  ],
}

export const TimelineBlock: Block = {
  slug: 'timeline',
  labels: { singular: 'Frise de réalisations', plural: 'Frises de réalisations' },
  fields: [
    { name: 'title', label: 'Intertitre (H2)', type: 'text', required: true },
    { name: 'items', label: 'Réalisations', type: 'array', fields: [
      { name: 'year', label: 'Année', type: 'text', required: true },
      { name: 'text', label: 'Réalisation', type: 'text', required: true },
    ] },
  ],
}

export const LinkCardsBlock: Block = {
  slug: 'linkCards',
  labels: { singular: 'Cartes de liens', plural: 'Cartes de liens' },
  fields: [
    { name: 'title', label: 'Intertitre (H2, facultatif)', type: 'text' },
    { name: 'style', label: 'Présentation', type: 'select', defaultValue: 'cards', options: [
      { label: 'Cartes encadrées', value: 'cards' },
      { label: 'Trois colonnes à filet', value: 'doors' },
      { label: 'Cartes avec photo (accueil)', value: 'photo' },
    ] },
    { name: 'items', label: 'Cartes', type: 'array', fields: [
      { name: 'eyebrow', label: 'Surtitre', type: 'text' },
      { name: 'title', label: 'Titre', type: 'text', required: true },
      { name: 'text', label: 'Texte', type: 'text' },
      { name: 'href', label: 'Lien', type: 'text', required: true },
      { name: 'linkLabel', label: 'Texte du lien (cartes avec photo)', type: 'text', admin: { description: 'Ex. « Voir les formations ». Par défaut : « En savoir plus ».' } },
      { name: 'image', label: 'Photo (cartes avec photo)', type: 'upload', relationTo: 'media' },
    ] },
  ],
}

export const PartnersBlock: Block = {
  slug: 'partners',
  labels: { singular: 'Logos partenaires', plural: 'Logos partenaires' },
  fields: [{ name: 'title', label: 'Intertitre (H2)', type: 'text', required: true }],
}

export const DemandBlock: Block = {
  slug: 'demand',
  labels: { singular: 'Appel à l’action', plural: 'Appels à l’action' },
  fields: [
    { name: 'title', label: 'Titre', type: 'text', required: true },
    { name: 'text', label: 'Phrase', type: 'text' },
    { name: 'buttons', label: 'Boutons', type: 'array', maxRows: 2, fields: ctaFields },
    { name: 'style', label: 'Présentation', type: 'select', defaultValue: 'section', options: [
      { label: 'Section pêche (pleine largeur)', value: 'section' },
      { label: 'Bandeau rouge compact', value: 'band' },
    ] },
  ],
}

export const pageBlocks = [HeroBlock, DomainIndexBlock, ReferencesBlock, TextBlock, StepsBlock, ListBlock, StatsBlock, TimelineBlock, LinkCardsBlock, PartnersBlock, DemandBlock]
