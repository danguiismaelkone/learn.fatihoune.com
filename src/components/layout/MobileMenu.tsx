'use client'

import Link from 'next/link'
import { useState } from 'react'
import { mainNav, type NavLink } from '@/config/site'

type Props = { domains: NavLink[]; solutions: NavLink[]; audiences: NavLink[] }

/** One collapsible group of the mobile menu (native <details>: works with the keyboard and screen readers). */
function Group({ label, href, links }: { label: string; href?: string; links: NavLink[] }) {
  if (!links.length) return null
  return (
    <details className="mobile-menu__group">
      <summary className="mobile-menu__link">
        {label} <span aria-hidden="true" className="nav__chevron" />
      </summary>
      <ul>
        {links.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}
        {href ? <li><Link className="link" href={href}>Tout voir</Link></li> : null}
      </ul>
    </details>
  )
}

export function MobileMenu({ domains, solutions, audiences }: Props) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? 'Fermer' : 'Menu'}
      </button>
      <div id="mobile-menu" className="mobile-menu" hidden={!open} style={{ position: 'absolute', left: 0, right: 0, top: '100%' }}>
        <div className="container">
          {/* Close the menu as soon as a link inside it is followed. */}
          <nav aria-label="Menu mobile" onClick={(e) => (e.target as HTMLElement).closest('a') && setOpen(false)}>
            <Group label="Formations" href="/formations" links={domains} />
            <Group label="Solutions" links={solutions} />
            <Group label="Vous êtes" links={audiences} />
            {mainNav.map((item) => (
              <Link key={item.href} className="mobile-menu__link" href={item.href}>
                {item.label} <span aria-hidden="true">›</span>
              </Link>
            ))}
            <p className="cluster" style={{ paddingBlock: 'var(--s-3)' }}>
              <Link className="link" href="/certificats">Certificats</Link>
              <Link className="link" href="/a-propos">Qui sommes-nous</Link>
            </p>
            <Link className="btn btn--primary btn--block" href="/contact?type=quote">
              Demander un devis
            </Link>
          </nav>
        </div>
      </div>
    </>
  )
}
