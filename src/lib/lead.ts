/** Shared validation for the contact form — used by the browser and re-run on the server. */
export type LeadType = 'quote' | 'info' | 'partnership'
export const LEAD_TYPES: LeadType[] = ['quote', 'info', 'partnership']

export type LeadInput = {
  type: LeadType
  name: string
  company: string
  jobTitle: string
  phone: string
  email: string
  topic: string
  participants: string
  message: string
  consent: boolean
  sourcePage: string
}

export type LeadErrors = Partial<Record<keyof LeadInput | 'contact', string>>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE = /^[+()\d\s.-]{8,20}$/

export function validateLead(v: LeadInput): LeadErrors {
  const e: LeadErrors = {}
  if (!LEAD_TYPES.includes(v.type)) e.type = 'Choisissez le type de votre demande.'
  if (v.name.trim().length < 2) e.name = 'Indiquez votre nom et votre prénom.'
  if (v.type !== 'info' && v.company.trim().length < 2) e.company = 'Indiquez le nom de votre entreprise ou organisme.'
  if (!v.phone.trim() && !v.email.trim()) e.contact = 'Indiquez un téléphone ou un e-mail pour qu’on puisse vous répondre.'
  if (v.phone.trim() && !PHONE.test(v.phone.trim())) e.phone = 'Ce numéro ne semble pas valide. Exemple : 07 09 90 16 47.'
  if (v.email.trim() && !EMAIL.test(v.email.trim())) e.email = 'Cette adresse e-mail ne semble pas valide. Exemple : nom@entreprise.ci.'
  if (v.participants.trim() && !/^\d{1,4}$/.test(v.participants.trim())) e.participants = 'Indiquez un nombre, par exemple 12.'
  if (v.message.trim().length < 10) e.message = 'Décrivez votre besoin en quelques mots (10 caractères minimum).'
  if (v.message.length > 3000) e.message = 'Votre message est trop long (3 000 caractères maximum).'
  if (!v.consent) e.consent = 'Cochez cette case pour que nous puissions traiter votre demande.'
  return e
}

export function readLead(form: FormData): LeadInput {
  const s = (k: string) => String(form.get(k) ?? '').slice(0, 3000)
  return {
    type: s('type') as LeadType,
    name: s('name'),
    company: s('company'),
    jobTitle: s('jobTitle'),
    phone: s('phone'),
    email: s('email'),
    topic: s('topic'),
    participants: s('participants'),
    message: s('message'),
    consent: form.get('consent') === 'on',
    sourcePage: s('sourcePage'),
  }
}
