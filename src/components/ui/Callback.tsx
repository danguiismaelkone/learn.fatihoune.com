'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useActionState, useState } from 'react'
import { submitCallback, type CallbackState } from '@/app/(site)/contact/actions'
import { CALLBACK_SLOTS, CALLBACK_SLOT_LABELS, validateCallback, type CallbackErrors, type CallbackInput } from '@/lib/lead'

/** Paths where the block would duplicate a form already on the page. */
const HIDDEN_ON = ['/contact']

/** « Vous souhaitez être rappelé ? » — shown above the footer on every page; creates a `callback` lead. */
export function Callback({ whatsappUrl }: { whatsappUrl: string }) {
  const pathname = usePathname() || '/'
  const [state, action, pending] = useActionState<CallbackState, FormData>(submitCallback, { status: 'idle' })
  const [clientErrors, setClientErrors] = useState<CallbackErrors>({})
  if (HIDDEN_ON.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return null

  const values: Partial<CallbackInput> = state.status === 'invalid' || state.status === 'error' ? state.values : {}
  const errors: CallbackErrors = { ...(state.status === 'invalid' ? state.errors : {}), ...clientErrors }
  const sourcePage = pathname === '/' ? 'accueil' : pathname.slice(1)

  const err = (name: keyof CallbackErrors) =>
    errors[name] ? <p className="field__error" id={`cb-err-${name}`}>{errors[name]}</p> : null
  const described = (name: keyof CallbackErrors) => (errors[name] ? `cb-err-${name}` : undefined)

  function onBlurValidate(e: React.FocusEvent<HTMLFormElement>) {
    const field = (e.target as unknown as HTMLInputElement).name as keyof CallbackErrors
    if (field !== 'name' && field !== 'phone') return
    const fd = new FormData(e.currentTarget)
    const all = validateCallback({
      name: String(fd.get('name') ?? ''), phone: String(fd.get('phone') ?? ''), slot: 'anytime', topic: '', consent: true, sourcePage,
    })
    setClientErrors((prev) => {
      const next = { ...prev }
      // Only flag a field once the visitor has typed something in it.
      if (all[field] && String(fd.get(field) ?? '').length > 0) next[field] = all[field]
      else delete next[field]
      return next
    })
  }

  return (
    <section className="section section--warm section--ruled callback" aria-labelledby="callback-title">
      <div className="container callback__inner">
        <div className="stack stack--sm">
          <h2 className="heading heading--2" id="callback-title">Vous souhaitez être rappelé ?</h2>
          <p className="text">Laissez votre numéro : un conseiller FATIHOUNE vous rappelle pour parler de votre besoin de formation et de son financement FDFP.</p>
        </div>

        {state.status === 'success' ? (
          <div className="alert alert--ok stack stack--sm" role="status" tabIndex={-1} ref={(el) => el?.focus()}>
            <span className="check" aria-hidden="true">✓</span>
            <strong className="heading heading--3">C’est noté, nous vous rappelons.</strong>
            <p className="text">Besoin d’une réponse tout de suite ? Écrivez-nous sur WhatsApp.</p>
            <a className="btn btn--secondary" href={whatsappUrl} target="_blank" rel="noopener noreferrer">Écrire sur WhatsApp</a>
          </div>
        ) : (
          <form className="callback__form" action={action} noValidate onBlur={onBlurValidate}>
            {state.status === 'error' ? (
              <div className="alert stack stack--sm callback__full" role="alert">
                <strong>{state.message}</strong>
                <a className="link" href={whatsappUrl} target="_blank" rel="noopener noreferrer">Écrire sur WhatsApp</a>
              </div>
            ) : null}
            <div className="field">
              <label className="field__label" htmlFor="cb-name">Nom et prénom</label>
              <input className="input" id="cb-name" name="name" autoComplete="name" required defaultValue={values.name} aria-invalid={Boolean(errors.name)} aria-describedby={described('name')} />
              {err('name')}
            </div>
            <div className="field">
              <label className="field__label" htmlFor="cb-phone">Téléphone</label>
              <input className="input" id="cb-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" required defaultValue={values.phone} aria-invalid={Boolean(errors.phone)} aria-describedby={described('phone')} />
              {err('phone')}
            </div>
            <div className="field">
              <label className="field__label" htmlFor="cb-slot">Moment préféré</label>
              <select className="input" id="cb-slot" name="slot" defaultValue={values.slot ?? 'anytime'} aria-invalid={Boolean(errors.slot)} aria-describedby={described('slot')}>
                {CALLBACK_SLOTS.map((s) => <option key={s} value={s}>{CALLBACK_SLOT_LABELS[s]}</option>)}
              </select>
              {err('slot')}
            </div>
            <div className="field callback__full">
              <label className="consent">
                <input type="checkbox" name="consent" defaultChecked={values.consent} aria-invalid={Boolean(errors.consent)} aria-describedby={described('consent')} />
                <span>J’accepte que FATIHOUNE utilise ce numéro pour me rappeler. <Link className="link" href="/confidentialite">Confidentialité</Link></span>
              </label>
              {err('consent')}
            </div>
            <div className="hp" aria-hidden="true">
              <label htmlFor="cb-website">Ne pas remplir</label>
              <input id="cb-website" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            <input type="hidden" name="sourcePage" value={sourcePage} />
            <div className="callback__full">
              <button className="btn btn--primary" type="submit" disabled={pending}>
                {pending ? 'Envoi en cours…' : 'Être rappelé'}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
