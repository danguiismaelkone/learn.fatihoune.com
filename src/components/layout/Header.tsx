import Image from 'next/image'
import Link from 'next/link'
import { mainNav } from '@/config/site'
import { getDomains } from '@/content/queries/trainings'
import { MobileMenu } from './MobileMenu'

const pad = (n: number) => String(n).padStart(2, '0')

export async function Header() {
  const domains = await getDomains()
  return (
    <header className="header">
      <div className="container header__bar">
        <Link className="brand" href="/" aria-label="FATIHOUNE — accueil">
          <Image src="/brand/fatihoune-symbol.png" alt="" width={66} height={26} priority />
          FATIHOUNE
        </Link>
        <nav className="nav" aria-label="Menu principal">
          <details className="nav__formations">
            <summary>Formations ▾</summary>
            <div className="mega">
              <div className="container mega__inner">
                <div>
                  <span className="eyebrow">{domains.length} domaines de formation</span>
                  <ol>
                    {domains.map((d, i) => (
                      <li key={d.id}>
                        <Link href={`/formations/${d.slug}`}>
                          <em className="num">{pad(i + 1)}</em>
                          {d.title}
                        </Link>
                      </li>
                    ))}
                  </ol>
                  <p style={{ marginTop: 'var(--s-3)' }}>
                    <Link className="link" href="/formations">
                      Toutes les formations
                    </Link>
                  </p>
                </div>
                <div className="callout stack stack--sm">
                  <strong>Certificats de spécialisation</strong>
                  <span className="text--soft">Cinq cycles longs de 100 à 120 heures.</span>
                  <Link className="link" href="/certificats">
                    Voir les certificats
                  </Link>
                </div>
              </div>
            </div>
          </details>
          {mainNav.slice(1).map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <Link className="btn btn--primary btn--compact" href="/contact?type=quote">
            Demander un devis
          </Link>
        </nav>
        <Link className="header__search" href="/recherche" aria-label="Rechercher une formation">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="m15.5 15.5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </Link>
        <MobileMenu />
      </div>
    </header>
  )
}
