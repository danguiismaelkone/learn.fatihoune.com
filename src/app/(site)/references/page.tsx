import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Eyebrow, Heading, Section } from '@/components/primitives'
import { StickyCta } from '@/components/ui/StickyCta'
import { REFERENCE_CATEGORIES, getCitableReferences } from '@/content/queries/references'
import { getSiteSettings } from '@/content/queries/settings'
import type { Media } from '@/payload-types'

export const metadata: Metadata = {
  title: 'Références et agrément FDFP | FATIHOUNE formation',
  description:
    'Ministères, collectivités, institutions et partenaires internationaux nous font confiance. Découvrez nos références, notre agrément FDFP et nos résultats.',
  alternates: { canonical: '/references' },
}

type Props = { searchParams: Promise<{ categorie?: string }> }

export default async function ReferencesPage({ searchParams }: Props) {
  const { categorie } = await searchParams
  const [refs, settings] = await Promise.all([getCitableReferences(), getSiteSettings()])
  const present = REFERENCE_CATEGORIES.filter((c) => refs.some((r) => r.category === c.value))
  const active = present.find((c) => c.value === categorie)?.value
  const shown = active ? refs.filter((r) => r.category === active) : refs
  const presentation = typeof settings.presentationPdf === 'object' ? (settings.presentationPdf as Media | null) : null
  const catalog = typeof settings.catalogPdf === 'object' ? (settings.catalogPdf as Media | null) : null

  return (
    <>
      <Breadcrumbs items={[{ label: 'Références' }]} />
      <section className="container hero" aria-labelledby="r-title">
        <div className="motif hero__motif" aria-hidden="true" />
        <div className="stack">
          <Eyebrow>{refs.length} références</Eyebrow>
          <Heading as="h1" id="r-title">Nos références : ministères, collectivités, institutions et entreprises</Heading>
          <p className="text text--soft">Depuis sa création, FATIHOUNE a formé et accompagné des équipes pour des organismes publics, des collectivités et des partenaires internationaux, partout en Côte d’Ivoire.</p>
        </div>
      </section>

      {settings.accreditations?.length ? (
        <Section tone="white" ruled labelledBy="acc">
          <div className="stack">
            <Heading id="acc">Agréments</Heading>
            <ul className="cards">
              {settings.accreditations.map((a) => (
                <li key={a.id}><div className="card"><strong className="heading heading--3">{a.fullName}</strong>{a.detail ? <p className="text text--soft">{a.detail}</p> : null}</div></li>
              ))}
            </ul>
          </div>
        </Section>
      ) : null}

      {settings.keyFigures?.length ? (
        <Section tight>
          <ul className="stats">{settings.keyFigures.map((f) => <li key={f.id}><span className="stat__value">{f.value}</span><span className="stat__label">{f.label}</span></li>)}</ul>
        </Section>
      ) : null}

      <Section tone="white" ruled labelledBy="clients-title">
        <div className="stack stack--lg">
          <Heading id="clients-title">Ils nous ont fait confiance</Heading>
          {present.length > 1 ? (
            <nav aria-label="Filtrer par catégorie">
              <ul className="chips">
                <li><Link className="chip" aria-current={!active ? 'true' : undefined} style={!active ? { background: 'var(--ink)', color: 'var(--white)', borderColor: 'var(--ink)' } : undefined} href="/references#clients-title" scroll={false}>Tous ({refs.length})</Link></li>
                {present.map((c) => {
                  const on = c.value === active
                  return (
                    <li key={c.value}>
                      <Link className="chip" aria-current={on ? 'true' : undefined} style={on ? { background: 'var(--ink)', color: 'var(--white)', borderColor: 'var(--ink)' } : undefined} href={`/references?categorie=${c.value}#clients-title`} scroll={false}>
                        {c.short} ({refs.filter((r) => r.category === c.value).length})
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
          ) : null}
          <ul className="clients">
            {shown.map((r) => {
              const logo = typeof r.logo === 'object' ? (r.logo as Media | null) : null
              return (
                <li key={r.id}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {logo?.url ? <img src={logo.url} alt={`Logo de ${r.name}`} /> : null}
                  <span>{r.name}</span>
                  {r.city ? <small>{r.city}</small> : null}
                </li>
              )
            })}
          </ul>
        </div>
      </Section>

      {presentation?.url || catalog?.url ? (
        <Section labelledBy="docs">
          <div className="stack">
            <Heading id="docs">Documents à télécharger</Heading>
            <div className="cluster">
              {presentation?.url ? <a className="btn btn--secondary" href={presentation.url} download>Présentation de FATIHOUNE (PDF)</a> : null}
              {catalog?.url ? <a className="btn btn--secondary" href={catalog.url} download>Catalogue des formations (PDF)</a> : null}
            </div>
          </div>
        </Section>
      ) : null}

      <Section tone="warm">
        <div className="stack">
          <Heading>Vous préparez un appel d’offres ou un projet de formation ?</Heading>
          <div className="cluster"><Link id="primary-cta" className="btn btn--primary" href="/contact?type=quote&from=references">Nous contacter</Link></div>
        </div>
      </Section>
      <StickyCta href="/contact?type=quote&from=references" label="Nous contacter" />
    </>
  )
}
