/** Shared validation for the contact and callback forms — used by the browser and re-run on the server. */
export type LeadType = 'quote' | 'info' | 'partnership' | 'advice'
export const LEAD_TYPES: LeadType[] = ['quote', 'info', 'partnership', 'advice']

/** Where a quoted training would take place. */
export const TRAINING_LOCATIONS = ['client', 'fatihoune', 'undecided'] as const
export type TrainingLocation = (typeof TRAINING_LOCATIONS)[number]
export const TRAINING_LOCATION_LABELS: Record<TrainingLocation, string> = {
  client: 'Dans les locaux de l’entreprise',
  fatihoune: 'Dans les locaux de FATIHOUNE',
  undecided: 'À définir',
}

export type LeadInput = {
  type: LeadType
  name: string
  company: string
  jobTitle: string
  phone: string
  email: string
  topic: string
  participants: string
  location: string
  fdfp: boolean
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
  if ((v.type === 'quote' || v.type === 'partnership') && v.company.trim().length < 2) e.company = 'Indiquez le nom de votre entreprise ou organisme.'
  if (!v.phone.trim() && !v.email.trim()) e.contact = 'Indiquez un téléphone ou un e-mail pour qu’on puisse vous répondre.'
  if (v.phone.trim() && !PHONE.test(v.phone.trim())) e.phone = 'Ce numéro ne semble pas valide. Exemple : 07 09 90 16 47.'
  if (v.email.trim() && !EMAIL.test(v.email.trim())) e.email = 'Cette adresse e-mail ne semble pas valide. Exemple : nom@entreprise.ci.'
  if (v.participants.trim() && !/^\d{1,4}$/.test(v.participants.trim())) e.participants = 'Indiquez un nombre, par exemple 12.'
  if (v.location && !TRAINING_LOCATIONS.includes(v.location as TrainingLocation)) e.location = 'Choisissez un lieu dans la liste.'
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
    location: s('location'),
    fdfp: form.get('fdfp') === 'on',
    message: s('message'),
    consent: form.get('consent') === 'on',
    sourcePage: s('sourcePage'),
  }
}

export const CALLBACK_SLOTS = ['morning', 'afternoon', 'anytime'] as const
export type CallbackSlot = (typeof CALLBACK_SLOTS)[number]
export const CALLBACK_SLOT_LABELS: Record<CallbackSlot, string> = {
  morning: 'Le matin',
  afternoon: 'L’après-midi',
  anytime: 'Peu importe',
}

export type CallbackInput = {
  name: string
  phone: string
  slot: CallbackSlot
  topic: string
  consent: boolean
  sourcePage: string
}

export type CallbackErrors = Partial<Record<keyof CallbackInput, string>>

export function validateCallback(v: CallbackInput): CallbackErrors {
  const e: CallbackErrors = {}
  if (v.name.trim().length < 2) e.name = 'Indiquez votre nom et votre prénom.'
  if (!v.phone.trim()) e.phone = 'Indiquez le numéro auquel vous rappeler.'
  else if (!PHONE.test(v.phone.trim())) e.phone = 'Ce numéro ne semble pas valide. Exemple : 07 09 90 16 47.'
  if (!CALLBACK_SLOTS.includes(v.slot)) e.slot = 'Choisissez un moment pour le rappel.'
  if (!v.consent) e.consent = 'Cochez cette case pour que nous puissions vous rappeler.'
  return e
}

export function readCallback(form: FormData): CallbackInput {
  const s = (k: string) => String(form.get(k) ?? '').slice(0, 200)
  return {
    name: s('name'),
    phone: s('phone'),
    slot: s('slot') as CallbackSlot,
    topic: s('topic'),
    consent: form.get('consent') === 'on',
    sourcePage: s('sourcePage'),
  }
}
