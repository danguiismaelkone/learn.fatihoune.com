import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Eyebrow, Heading } from '@/components/primitives'
import { SearchForm } from '@/components/ui/SearchForm'
import { contactHref } from '@/components/ui/cta'
import { searchTrainings } from '@/content/queries/search'
import { getDomains } from '@/content/queries/trainings'

export const metadata: Metadata = {
  title: 'Rechercher une formation | FATIHOUNE',
  robots: { index: false, follow: true }, // result pages are not indexed; the domain pages are.
}

type Props = { searchParams: Promise<{ q?: string }> }

export default async function SearchPage({ searchParams }: Props) {
  const q = ((await searchParams).q ?? '').trim().slice(0, 80)
  const [{ total, groups, domains: matchedDomains }, domains] = await Promise.all([searchTrainings(q), getDomains()])
  const shown = groups.reduce((a, g) => a + g.items.length, 0)

  return (
    <>
      <Breadcrumbs items={[{ label: 'Formations', href: '/formations' }, { label: 'Recherche' }]} />
      <div className="container stack stack--lg" style={{ paddingBlock: 'var(--s-5) var(--section-y)' }}>
        <div className="stack">
          <Eyebrow>Plus de 350 formations</Eyebrow>
          <Heading as="h1">Rechercher une formation</Heading>
          <SearchForm defaultValue={q} />
        </div>

        {q ? (
          <p className="text" role="status">
            {total === 0
              ? <>Aucune formation ne correspond exactement à « {q} ».</>
              : <>{total} formation{total > 1 ? 's' : ''} pour « {q} »{total > shown ? ` — les ${shown} plus pertinentes sont affichées` : ''}.</>}
          </p>
        ) : null}

        {matchedDomains.length ? (
          <div className="callout stack stack--sm">
            <strong>Domaine{matchedDomains.length > 1 ? 's' : ''} correspondant{matchedDomains.length > 1 ? 's' : ''}</strong>
            <ul className="chips" style={{ flexWrap: 'wrap' }}>
              {matchedDomains.map((d) => <li key={d.slug}><Link className="chip" href={`/formations/${d.slug}`}>{d.title} ›</Link></li>)}
            </ul>
          </div>
        ) : null}

        {groups.map((g) => (
          <section key={g.domainSlug} className="stack stack--sm" aria-labelledby={`r-${g.domainSlug}`}>
            <h2 className="heading heading--2 group__title" id={`r-${g.domainSlug}`}>
              <Link href={`/formations/${g.domainSlug}`}>{g.domainTitle}</Link>
              <span className="group__count">{g.items.length}</span>
            </h2>
            <ul className="themes">
              {g.items.map((t) => (
                <li key={t.id}>
                  <span>{t.title}</span>
                  <span className="themes__duration">{t.duration ?? ''}</span>
                  <Link className="link themes__ask" href={contactHref('quote', `${g.domainTitle} › ${t.title}`, 'recherche')}>
                    Demander cette formation<span className="sr-only"> : {t.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}

        {q && total === 0 && !matchedDomains.length ? (
          <div className="callout stack stack--sm">
            <strong>Votre besoin ne figure pas dans notre catalogue ?</strong>
            <p className="text">Nous concevons aussi des formations sur mesure. Décrivez-nous ce que vous cherchez : nous vous proposons un programme adapté.</p>
            <div><Link className="btn btn--primary" href={contactHref('quote', q, 'recherche')}>Demander une formation sur mesure</Link></div>
          </div>
        ) : null}

        <nav className="stack stack--sm" aria-labelledby="browse">
          <Heading as="h2" size={3} id="browse">Ou parcourez nos domaines</Heading>
          <ul className="chips" style={{ flexWrap: 'wrap' }}>
            {domains.map((d) => <li key={d.id}><Link className="chip" href={`/formations/${d.slug}`}>{d.title}</Link></li>)}
          </ul>
        </nav>
      </div>
    </>
  )
}
