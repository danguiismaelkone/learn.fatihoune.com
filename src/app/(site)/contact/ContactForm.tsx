'use client'

import Link from 'next/link'
import { useActionState, useState } from 'react'
import { validateLead, type LeadErrors, type LeadInput, type LeadType } from '@/lib/lead'
import { submitLead, type SubmitState } from './actions'

type Props = { initialType: LeadType; initialTopic: string; sourcePage: string; whatsappUrl: string; responseDelay?: string | null }

const TYPES: { value: LeadType; label: string }[] = [
  { value: 'quote', label: 'Un devis pour mon entreprise' },
  { value: 'info', label: 'Une information (formation, certificat, programme)' },
  { value: 'partnership', label: 'Un partenariat' },
]

export function ContactForm({ initialType, initialTopic, sourcePage, whatsappUrl, responseDelay }: Props) {
  const [state, action, pending] = useActionState<SubmitState, FormData>(submitLead, { status: 'idle' })
  const [type, setType] = useState<LeadType>(initialType)
  const [clientErrors, setClientErrors] = useState<LeadErrors>({})
  const values: Partial<LeadInput> = state.status === 'invalid' || state.status === 'error' ? state.values : {}
  const errors: LeadErrors = { ...(state.status === 'invalid' ? state.errors : {}), ...clientErrors }

  if (state.status === 'success') {
    return (
      <div className="alert alert--ok stack stack--sm" role="status" tabIndex={-1} ref={(el) => el?.focus()}>
        <span className="check" aria-hidden="true">✓</span>
        <strong className="heading heading--3">Merci, votre demande a bien été envoyée.</strong>
        <p className="text">Nous vous recontactons{responseDelay ? ` ${responseDelay}` : ' rapidement'}. Pour une réponse plus rapide, écrivez-nous sur WhatsApp.</p>
        <a className="btn btn--secondary" href={whatsappUrl} target="_blank" rel="noopener noreferrer">Écrire sur WhatsApp</a>
      </div>
    )
  }

  const err = (name: keyof LeadErrors) =>
    errors[name] ? <p className="field__error" id={`err-${name}`}>{errors[name]}</p> : null
  const described = (name: keyof LeadErrors) => (errors[name] ? `err-${name}` : undefined)

  function onBlurValidate(e: React.FocusEvent<HTMLFormElement>) {
    const fd = new FormData(e.currentTarget)
    const field = (e.target as unknown as HTMLInputElement).name
    if (!field) return
    const all = validateLead({
      type, name: String(fd.get('name') ?? ''), company: String(fd.get('company') ?? ''), jobTitle: '', phone: String(fd.get('phone') ?? ''),
      email: String(fd.get('email') ?? ''), topic: '', participants: String(fd.get('participants') ?? ''), message: String(fd.get('message') ?? ''),
      consent: fd.get('consent') === 'on', sourcePage,
    })
    const key = (field === 'phone' || field === 'email') && all.contact ? 'contact' : (field as keyof LeadErrors)
    setClientErrors((prev) => {
      const next = { ...prev }
      // Only show an error for the field just left, and only if it has been touched with content or is required.
      if (all[key as keyof LeadErrors] && String(fd.get(field) ?? '').length > 0) next[key as keyof LeadErrors] = all[key as keyof LeadErrors]
      else delete next[key as keyof LeadErrors]
      if (field === 'phone' || field === 'email') { if (!all.phone) delete next.phone; if (!all.email) delete next.email; if (!all.contact) delete next.contact }
      return next
    })
  }

  return (
    <form className="form" action={action} noValidate onBlur={onBlurValidate} aria-describedby={state.status === 'error' ? 'form-error' : undefined}>
      {state.status === 'error' ? (
        <div className="alert stack stack--sm" id="form-error" role="alert">
          <strong>{state.message}</strong>
          <span>Vos informations sont conservées ci-dessous.</span>
          <a className="btn btn--secondary" href={whatsappUrl} target="_blank" rel="noopener noreferrer">Écrire sur WhatsApp</a>
        </div>
      ) : null}
      {state.status === 'invalid' ? (
        <p className="field__error" role="alert">Votre demande n’est pas encore complète : corrigez les champs signalés.</p>
      ) : null}

      <fieldset className="radios">
        <legend className="legend" style={{ marginBottom: 6 }}>Votre demande concerne :</legend>
        {TYPES.map((t) => (
          <label key={t.value} className="radio">
            <input type="radio" name="type" value={t.value} checked={type === t.value} onChange={() => setType(t.value)} /> {t.label}
          </label>
        ))}
      </fieldset>

      <div className="field">
        <label className="field__label" htmlFor="name">Nom et prénom</label>
        <input className="input" id="name" name="name" autoComplete="name" required defaultValue={values.name} aria-invalid={Boolean(errors.name)} aria-describedby={described('name')} />
        {err('name')}
      </div>
      {type !== 'info' ? (
        <div className="field">
          <label className="field__label" htmlFor="company">Entreprise ou organisme</label>
          <input className="input" id="company" name="company" autoComplete="organization" required defaultValue={values.company} aria-invalid={Boolean(errors.company)} aria-describedby={described('company')} />
          {err('company')}
        </div>
      ) : null}
      {type === 'quote' ? (
        <div className="field">
          <label className="field__label" htmlFor="jobTitle">Fonction <span className="field__hint">(facultatif)</span></label>
          <input className="input" id="jobTitle" name="jobTitle" autoComplete="organization-title" defaultValue={values.jobTitle} />
        </div>
      ) : null}
      <div className="field">
        <label className="field__label" htmlFor="phone">Téléphone</label>
        <input className="input" id="phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" defaultValue={values.phone} aria-invalid={Boolean(errors.phone || errors.contact)} aria-describedby={described('phone') ?? described('contact')} />
        {err('phone')}
      </div>
      <div className="field">
        <label className="field__label" htmlFor="email">E-mail</label>
        <input className="input" id="email" name="email" type="email" autoComplete="email" defaultValue={values.email} aria-invalid={Boolean(errors.email || errors.contact)} aria-describedby={described('email') ?? described('contact')} />
        {err('email')}
        {err('contact')}
        <span className="field__hint">Un téléphone ou un e-mail suffit.</span>
      </div>
      <div className="field">
        <label className="field__label" htmlFor="topic">Formation ou domaine concerné <span className="field__hint">(facultatif)</span></label>
        <input className="input" id="topic" name="topic" defaultValue={values.topic ?? initialTopic} />
      </div>
      {type === 'quote' ? (
        <div className="field">
          <label className="field__label" htmlFor="participants">Nombre de participants <span className="field__hint">(une estimation suffit)</span></label>
          <input className="input" id="participants" name="participants" inputMode="numeric" defaultValue={values.participants} aria-invalid={Boolean(errors.participants)} aria-describedby={described('participants')} style={{ maxWidth: '10rem' }} />
          {err('participants')}
        </div>
      ) : null}
      <div className="field">
        <label className="field__label" htmlFor="message">Votre message</label>
        <textarea className="input" id="message" name="message" rows={5} required defaultValue={values.message} aria-invalid={Boolean(errors.message)} aria-describedby={described('message') ?? 'message-hint'} />
        <span className="field__hint" id="message-hint">Décrivez votre besoin en quelques lignes.</span>
        {err('message')}
      </div>
      <div className="field">
        <label className="consent">
          <input type="checkbox" name="consent" defaultChecked={values.consent} aria-invalid={Boolean(errors.consent)} aria-describedby={described('consent')} />
          <span>J’accepte que FATIHOUNE utilise ces informations pour répondre à ma demande. <Link className="link" href="/confidentialite">Confidentialité</Link></span>
        </label>
        {err('consent')}
      </div>
      <div className="hp" aria-hidden="true">
        <label htmlFor="website">Ne pas remplir</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="sourcePage" value={sourcePage} />
      <button className="btn btn--primary btn--block" type="submit" disabled={pending}>
        {pending ? 'Envoi en cours…' : 'Envoyer ma demande'}
      </button>
    </form>
  )
}
