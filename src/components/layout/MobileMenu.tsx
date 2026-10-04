'use client'

import Link from 'next/link'
import { useState } from 'react'
import { mainNav } from '@/config/site'

export function MobileMenu() {
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
            {mainNav.map((item) => (
              <Link key={item.href} className="mobile-menu__link" href={item.href}>
                {item.label} <span aria-hidden="true">›</span>
              </Link>
            ))}
            <p className="cluster" style={{ paddingBlock: 'var(--s-3)' }}>
              <Link className="link" href="/recherche">Rechercher une formation</Link>
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
