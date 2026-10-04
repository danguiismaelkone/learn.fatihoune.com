'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useActionState, useState } from 'react'
import { submitCallback, type CallbackState } from '@/app/(site)/contact/actions'
import { CALLBACK_SLOTS, CALLBACK_SLOT_LABELS, validateCallback, type CallbackErrors, type CallbackInput } from '@/lib/lead'

/** Paths where the block would duplicate a form already on the page. */
const HIDDEN_ON = ['/contact']

type FormProps = {
  whatsappUrl: string
  /** Prefix for field ids: the global block and a page's closing block can both be in the DOM. */
  idPrefix?: string
  /** `wide`: 3 fields on one row (full-width block); `compact`: narrow column. */
  layout?: 'wide' | 'compact'
}

/** Callback form: name, phone, preferred time slot. Creates a `callback` lead with the current page as source. */
export function CallbackForm({ whatsappUrl, idPrefix = 'cb', layout = 'wide' }: FormProps) {
  const pathname = usePathname() || '/'
  const [state, action, pending] = useActionState<CallbackState, FormData>(submitCallback, { status: 'idle' })
  const [clientErrors, setClientErrors] = useState<CallbackErrors>({})
  const values: Partial<CallbackInput> = state.status === 'invalid' || state.status === 'error' ? state.values : {}
  const errors: CallbackErrors = { ...(state.status === 'invalid' ? state.errors : {}), ...clientErrors }
  const sourcePage = pathname === '/' ? 'accueil' : pathname.slice(1)
  const id = (name: string) => `${idPrefix}-${name}`

  const err = (name: keyof CallbackErrors) =>
    errors[name] ? <p className="field__error" id={id(`err-${name}`)}>{errors[name]}</p> : null
  const described = (name: keyof CallbackErrors) => (errors[name] ? id(`err-${name}`) : undefined)

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

  if (state.status === 'success') {
    return (
      <div className="alert alert--ok stack stack--sm" role="status" tabIndex={-1} ref={(el) => el?.focus()}>
        <span className="check" aria-hidden="true">✓</span>
        <strong className="heading heading--3">C’est noté, nous vous rappelons.</strong>
        <p className="text">Besoin d’une réponse tout de suite ? Écrivez-nous sur WhatsApp.</p>
        <a className="btn btn--secondary" href={whatsappUrl} target="_blank" rel="noopener noreferrer">Écrire sur WhatsApp</a>
      </div>
    )
  }

  return (
    <form className={`callback__form callback__form--${layout}`} action={action} noValidate onBlur={onBlurValidate}>
      {state.status === 'error' ? (
        <div className="alert stack stack--sm callback__full" role="alert">
          <strong>{state.message}</strong>
          <a className="link" href={whatsappUrl} target="_blank" rel="noopener noreferrer">Écrire sur WhatsApp</a>
        </div>
      ) : null}
      <div className="field">
        <label className="field__label" htmlFor={id('name')}>Nom et prénom</label>
        <input className="input" id={id('name')} name="name" autoComplete="name" required defaultValue={values.name} aria-invalid={Boolean(errors.name)} aria-describedby={described('name')} />
        {err('name')}
      </div>
      <div className="field">
        <label className="field__label" htmlFor={id('phone')}>Téléphone</label>
        <input className="input" id={id('phone')} name="phone" type="tel" autoComplete="tel" inputMode="tel" required defaultValue={values.phone} aria-invalid={Boolean(errors.phone)} aria-describedby={described('phone')} />
        {err('phone')}
      </div>
      <div className="field callback__slot">
        <label className="field__label" htmlFor={id('slot')}>Moment préféré</label>
        <select className="input" id={id('slot')} name="slot" defaultValue={values.slot ?? 'anytime'} aria-invalid={Boolean(errors.slot)} aria-describedby={described('slot')}>
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
        <label htmlFor={id('website')}>Ne pas remplir</label>
        <input id={id('website')} name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="sourcePage" value={sourcePage} />
      <div className="callback__full">
        <button className="btn btn--primary" type="submit" disabled={pending}>
          {pending ? 'Envoi en cours…' : 'Être rappelé'}
        </button>
      </div>
    </form>
  )
}

/**
 * « Vous souhaitez être rappelé ? » — shown above the footer on every page.
 * Hidden (CSS) on pages whose last block already closes with a contact block that includes this form.
 */
export function Callback({ whatsappUrl }: { whatsappUrl: string }) {
  const pathname = usePathname() || '/'
  if (HIDDEN_ON.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return null
  return (
    <section className="section section--warm section--ruled callback" aria-labelledby="callback-title">
      <div className="container callback__inner">
        <div className="stack stack--sm">
          <h2 className="heading heading--2" id="callback-title">Vous souhaitez être rappelé ?</h2>
          <p className="text">Laissez votre numéro : un conseiller FATIHOUNE vous rappelle pour parler de votre besoin de formation et de son financement FDFP.</p>
        </div>
        <CallbackForm whatsappUrl={whatsappUrl} />
      </div>
    </section>
  )
}
