import Image from 'next/image'
import Link from 'next/link'
import { Media, mediaFromDoc } from '@/components/primitives'
import { whatsappHref } from '@/components/ui/cta'
import { ChatIcon } from '@/components/ui/icons'
import { ReadingProgress } from '@/components/ui/ScrollAids'
import { SearchDialog, SearchTrigger } from '@/components/ui/SearchDialog'
import { audienceNav, mainNav, solutionsNav, visibleLinks, type NavLink } from '@/config/site'
import { getAllPagePaths } from '@/content/queries/pages'
import { getSiteSettings } from '@/content/queries/settings'
import { getDomains } from '@/content/queries/trainings'
import type { Media as MediaDoc } from '@/payload-types'
import { MobileMenu } from './MobileMenu'
import { NavDropdown } from './NavDropdown'

const pad = (n: number) => String(n).padStart(2, '0')

function LinkList({ links }: { links: NavLink[] }) {
  return (
    <ul className="mega__links">
      {links.map((l) => (
        <li key={l.href}>
          <Link href={l.href}>
            <strong>{l.label}</strong>
            {l.hint ? <span>{l.hint}</span> : null}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export async function Header() {
  const [domains, settings, pages] = await Promise.all([getDomains(), getSiteSettings(), getAllPagePaths()])
  const published = new Set(pages.map((p) => p.path))
  const solutions = visibleLinks(solutionsNav, published)
  const audiences = visibleLinks(audienceNav, published)
  const featured = settings.featuredSolution?.title && settings.featuredSolution?.href ? settings.featuredSolution : null
  const featuredPhoto = featured
    ? mediaFromDoc(typeof featured.image === 'object' ? (featured.image as MediaDoc | null) : null, '320px')
    : null
  const popular = (settings.popularSearches ?? []).map((p) => p.term).filter(Boolean)

  return (
    <header className="header">
      {/* Utility row (desktop only): search button, phone, WhatsApp. On mobile the search icon and the menu cover these. */}
      <div className="header__util">
        <div className="container header__util-inner">
          <SearchTrigger variant="util" />
          <a className="header__util-link" href={`tel:${settings.phone.replace(/\s/g, '')}`}>
            Tél. {settings.phone}
          </a>
          <a className="header__util-link" href={whatsappHref(settings.whatsapp)} target="_blank" rel="noopener noreferrer">
            <ChatIcon className="header__util-icon" /> WhatsApp {settings.whatsappDisplay}
          </a>
        </div>
      </div>
      <div className="container header__bar">
        <Link className="brand" href="/" aria-label="FATIHOUNE — accueil">
          <Image src="/brand/fatihoune-symbol.png" alt="" width={66} height={26} priority />
          FATIHOUNE
        </Link>
        <nav className="nav" aria-label="Menu principal">
          <NavDropdown id="formations" label="Formations">
            <div className="container mega__inner">
              <div>
                <span className="eyebrow">{domains.length} domaines de formation</span>
                <ol className="mega__domains">
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
                  <Link className="link" href="/formations">Toutes les formations</Link>
                </p>
              </div>
              <div className="callout stack stack--sm">
                <strong>Certificats de spécialisation</strong>
                <span className="text--soft">Cinq cycles longs de 100 à 120 heures.</span>
                <Link className="link" href="/certificats">Voir les certificats</Link>
              </div>
            </div>
          </NavDropdown>

          <NavDropdown id="solutions" label="Solutions">
            <div className="container mega__inner">
              <div>
                <span className="eyebrow">Nos solutions</span>
                <LinkList links={solutions} />
                {published.has('solutions') ? (
                  <p style={{ marginTop: 'var(--s-3)' }}>
                    <Link className="link" href="/solutions">Toutes nos solutions</Link>
                  </p>
                ) : null}
              </div>
              {featured ? (
                <Link className="mega__feature" href={featured.href!}>
                  {featuredPhoto ? <Media {...featuredPhoto} alt="" /> : null}
                  <span className="mega__feature-body">
                    {featured.eyebrow ? <span className="eyebrow">{featured.eyebrow}</span> : null}
                    <strong className="heading heading--3">{featured.title}</strong>
                    {featured.text ? <span className="text--soft">{featured.text}</span> : null}
                    <span className="link">Découvrir</span>
                  </span>
                </Link>
              ) : null}
            </div>
          </NavDropdown>

          {audiences.length ? (
            <NavDropdown id="vous-etes" label="Vous êtes">
              <div className="container mega__inner mega__inner--single">
                <div>
                  <span className="eyebrow">Des réponses adaptées à votre situation</span>
                  <LinkList links={audiences} />
                </div>
              </div>
            </NavDropdown>
          ) : null}

          {mainNav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <Link className="btn btn--primary btn--compact" href="/contact?type=quote">
            Demander un devis
          </Link>
        </nav>
        <SearchTrigger variant="icon" />
        <MobileMenu
          domains={domains.map((d) => ({ href: `/formations/${d.slug}`, label: d.title }))}
          solutions={solutions}
          audiences={audiences}
        />
      </div>
      <ReadingProgress />
      <SearchDialog popular={popular} />
    </header>
  )
}
