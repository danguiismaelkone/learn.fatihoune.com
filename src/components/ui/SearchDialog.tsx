'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const OPEN_EVENT = 'search-dialog:open'

type Suggestions = {
  total: number
  domains: { title: string; slug: string }[]
  trainings: { title: string; duration: string | null; domain: string; href: string }[]
}

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="m15.5 15.5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

/** Button that opens the search dialog (several can exist: utility bar, mobile header). */
export function SearchTrigger({ variant }: { variant: 'util' | 'icon' }) {
  const open = () => window.dispatchEvent(new Event(OPEN_EVENT))
  if (variant === 'icon') {
    return (
      <button type="button" className="header__search" onClick={open} aria-label="Rechercher une formation" aria-haspopup="dialog">
        <SearchIcon />
      </button>
    )
  }
  return (
    <button type="button" className="search-trigger" onClick={open} aria-haspopup="dialog">
      <SearchIcon className="search-trigger__icon" />
      <span>Rechercher une formation</span>
      <kbd aria-hidden="true">/</kbd>
    </button>
  )
}

/**
 * Cegos-style search dialog: big field, popular searches, instant suggestions while typing.
 * Enter submits to /recherche (works without JavaScript through the trigger-less fallback page).
 */
export function SearchDialog({ popular }: { popular: string[] }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const [q, setQ] = useState('')
  const [data, setData] = useState<Suggestions | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const open = () => {
      if (!dialog.current?.open) dialog.current?.showModal()
      requestAnimationFrame(() => input.current?.focus())
    }
    const onKey = (e: KeyboardEvent) => {
      const target = e.target instanceof Element ? e.target : null
      const typing = target?.closest('input, textarea, select, [contenteditable="true"]')
      if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault()
        open()
      }
    }
    window.addEventListener(OPEN_EVENT, open)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener(OPEN_EVENT, open)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  // Debounced suggestions (2 characters minimum).
  useEffect(() => {
    const term = q.trim()
    if (term.length < 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setData(null)
      return
    }
    const controller = new AbortController()
    const t = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/recherche/suggestions?q=${encodeURIComponent(term)}`, { signal: controller.signal })
        if (res.ok) setData((await res.json()) as Suggestions)
      } catch {
        /* aborted or offline: keep the previous suggestions */
      } finally {
        setLoading(false)
      }
    }, 200)
    return () => {
      clearTimeout(t)
      controller.abort()
    }
  }, [q])

  const close = () => dialog.current?.close()
  const term = q.trim()

  return (
    <dialog
      ref={dialog}
      className="search-dialog"
      aria-labelledby="search-dialog-title"
      onClick={(e) => {
        // Click on the backdrop (outside the panel) or on a link inside closes the dialog.
        if (e.target === dialog.current || (e.target as HTMLElement).closest('a')) close()
      }}
    >
      <div className="search-dialog__panel">
        <button type="button" className="search-dialog__close" onClick={close} aria-label="Fermer la recherche">×</button>
        <h2 className="heading heading--2" id="search-dialog-title">Comment pouvons-nous vous aider ?</h2>
        <form className="search search--hero search-dialog__form" action="/recherche" method="get" role="search">
          <label className="sr-only" htmlFor="search-dialog-q">Rechercher une formation</label>
          <SearchIcon className="search__icon" />
          <input
            ref={input}
            className="search__input"
            id="search-dialog-q"
            name="q"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ex. Excel, management, ISO 45001, fiscalité…"
            autoComplete="off"
            enterKeyHint="search"
            maxLength={80}
            aria-describedby="search-dialog-status"
          />
          <button className="btn btn--primary search__button" type="submit">Rechercher</button>
        </form>

        <p className="sr-only" id="search-dialog-status" aria-live="polite">
          {term.length >= 2 && data ? `${data.total} formation${data.total > 1 ? 's' : ''} trouvée${data.total > 1 ? 's' : ''}` : ''}
        </p>

        {term.length < 2 ? (
          popular.length ? (
            <div className="search-dialog__popular">
              <span className="search-dialog__label">Recherches populaires</span>
              <ul className="cluster" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {popular.map((p) => (
                  <li key={p}><Link className="chip" href={`/recherche?q=${encodeURIComponent(p)}`}>{p}</Link></li>
                ))}
              </ul>
            </div>
          ) : null
        ) : (
          <div className="search-dialog__results" aria-busy={loading}>
            {data?.domains.length ? (
              <ul className="cluster" style={{ listStyle: 'none', margin: 0, padding: 0 }} aria-label="Domaines">
                {data.domains.map((d) => (
                  <li key={d.slug}><Link className="chip" href={`/formations/${d.slug}`}>{d.title} ›</Link></li>
                ))}
              </ul>
            ) : null}
            {data?.trainings.length ? (
              <ul className="search-dialog__list" aria-label="Formations">
                {data.trainings.map((t) => (
                  <li key={`${t.href}-${t.title}`}>
                    <Link href={t.href}>
                      <strong>{t.title}</strong>
                      <span>{t.domain}{t.duration ? ` · ${t.duration}` : ''}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
            {data && !data.trainings.length && !data.domains.length && !loading ? (
              <p className="text text--soft">Aucune formation ne correspond à « {term} ». Nous pouvons concevoir une formation sur mesure : <Link className="link" href={`/contact?type=quote&topic=${encodeURIComponent(term)}&from=recherche`}>demandez un devis</Link>.</p>
            ) : null}
            {data && data.total > data.trainings.length ? (
              <Link className="link" href={`/recherche?q=${encodeURIComponent(term)}`}>Voir les {data.total} résultats</Link>
            ) : null}
          </div>
        )}
      </div>
    </dialog>
  )
}
