import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Stats } from '@/components/blocks/RenderBlocks'
import { Eyebrow, Heading, Media, mediaFromDoc } from '@/components/primitives'
import { ChatIcon } from '@/components/ui/icons'
import { OpenOnHash } from '@/components/ui/OpenOnHash'
import { RichText } from '@/components/ui/RichText'
import { StickyCta } from '@/components/ui/StickyCta'
import { contactHref, whatsappHref } from '@/components/ui/cta'
import { siteConfig } from '@/config/site'
import { getSiteSettings } from '@/content/queries/settings'
import { getDomainBySlug, getDomainTrainings, getDomains } from '@/content/queries/trainings'
import { TRAINING_BADGE_LABELS, type TrainingBadge } from '@/lib/training'
import type { Certificate, Media as MediaDoc } from '@/payload-types'

export const revalidate = 300
type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return (await getDomains()).map((d) => ({ slug: d.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const domain = await getDomainBySlug((await params).slug)
  if (!domain) return {}
  return {
    title: domain.seo?.title || `${domain.title} | FATIHOUNE`,
    description: domain.seo?.description || domain.intro,
    alternates: { canonical: `/formations/${domain.slug}` },
  }
}

const anchorId = (title: string) =>
  title.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export default async function DomainPage({ params }: Props) {
  const domain = await getDomainBySlug((await params).slug)
  if (!domain) notFound()
  const [groups, settings, domains] = await Promise.all([getDomainTrainings(domain), getSiteSettings(), getDomains()])
  if (!groups.length) notFound() // a domain without published trainings is not shown
  const total = groups.reduce((a, g) => a + g.items.length, 0)
  const index = domains.findIndex((d) => d.id === domain.id) + 1
  const from = `formations/${domain.slug}`
  const quote = contactHref('quote', domain.title, from)
  const cert = typeof domain.relatedCertificate === 'object' ? (domain.relatedCertificate as Certificate | null) : null
  const others = domains.filter((d) => d.id !== domain.id).slice(0, 3)
  const photo = mediaFromDoc(typeof domain.image === 'object' ? (domain.image as MediaDoc | null) : null, '(min-width: 1024px) 33vw, 100vw')

  const courseList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: domain.title,
    itemListElement: groups.flatMap((g) => g.items).map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Course',
        name: t.title,
        description: `${t.title} — formation ${domain.title.toLowerCase()} par FATIHOUNE.`,
        provider: { '@type': 'Organization', name: 'FATIHOUNE', sameAs: siteConfig.url },
      },
    })),
  }

  return (
    <>
      <div className="domain-banner">
        <Breadcrumbs tone="dark" items={[{ label: 'Formations', href: '/formations' }, { label: domain.title }]} />
        <div className="container domain-banner__inner">
          <Eyebrow>Domaine {String(index).padStart(2, '0')} · {total} formations</Eyebrow>
          <Heading as="h1">{domain.h1}</Heading>
          <p className="text">{domain.intro}</p>
        </div>
        <div className="motif domain-banner__band" aria-hidden="true" />
      </div>
      <OpenOnHash />
      <div className="container with-aside">
        <div className="stack stack--lg" style={{ minWidth: 0 }}>
          <div className="stack">
            {photo ? <div className="only-mobile"><Media {...photo} priority /></div> : null}
            <ul className="proof" aria-label="Nos garanties">
              <li>Habilité FDFP</li><li>Sur mesure</li><li>En entreprise ou chez nous</li>
            </ul>
            <div><Link id="primary-cta" className="btn btn--primary" href={quote}>Demander un devis pour ce domaine</Link></div>
            {groups.length > 1 ? (
              <nav aria-label="Aller à un groupe de formations">
                <ul className="chips">
                  {groups.map((g) => <li key={g.title}><a className="chip" href={`#${anchorId(g.title)}`}>{g.title}</a></li>)}
                </ul>
              </nav>
            ) : null}
          </div>

          <div className="groups">
            {groups.map((g, i) => (
              <details key={g.title} id={anchorId(g.title)} className="group" open={i === 0}>
                <summary className="group__summary">
                  <h2 className="group__title" id={`g-${anchorId(g.title)}`}>{g.title}</h2>
                  <span className="group__count">{g.items.length} formation{g.items.length > 1 ? 's' : ''}</span>
                </summary>
                <ul className="themes" aria-labelledby={`g-${anchorId(g.title)}`}>
                  {g.items.map((t) => (
                    <li key={t.id}>
                      <span>
                        {t.detailPublished && t.slug ? (
                          <Link className="themes__title-link" href={`/formations/${domain.slug}/${t.slug}`}>{t.title}</Link>
                        ) : t.title}
                        {(t.badges ?? []).map((b) => (
                          <span key={b} className="badge">{TRAINING_BADGE_LABELS[b as TrainingBadge]}</span>
                        ))}
                      </span>
                      <span className="themes__duration">{t.durationLabel ?? ''}</span>
                      <Link className="link themes__ask" href={contactHref('quote', `${domain.title} › ${t.title}`, from)}>
                        Demander cette formation<span className="sr-only"> : {t.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>

          {domain.extra ? <div className="callout"><RichText data={domain.extra} /></div> : null}
          {cert ? (
            <div className="callout stack stack--sm">
              <strong>Pour aller plus loin</strong>
              <p className="text">Le {cert.title} ({cert.code}, {cert.durationHours} h) approfondit ce domaine sur un cycle long.</p>
              <Link className="link" href="/certificats">Voir les certificats</Link>
            </div>
          ) : null}

          <section className="stack" aria-labelledby="method">
            <Heading id="method">Comment se passe une formation avec FATIHOUNE</Heading>
            <ol className="steps">
              <li><div className="stack stack--sm"><strong>On analyse votre besoin</strong><p className="text text--soft">Nos experts analysent la situation de votre équipe et les compétences à renforcer.</p></div></li>
              <li><div className="stack stack--sm"><strong>On adapte le programme</strong><p className="text text--soft">Contenu, durée, lieu et calendrier : chaque thème est adapté à votre secteur et à vos cas réels. Vous recevez une fiche technique détaillée pour chaque formation retenue.</p></div></li>
              <li><div className="stack stack--sm"><strong>On forme vos équipes</strong><p className="text text--soft">Dans vos locaux ou dans les nôtres. Votre formation peut être financée par le FDFP. <Link className="link" href="/financement-fdfp">Financement FDFP</Link></p></div></li>
            </ol>
            <Stats settings={settings} />
          </section>

          <nav aria-labelledby="others" className="stack stack--sm">
            <Heading as="h2" size={3} id="others">Autres domaines</Heading>
            <ul className="chips" style={{ flexWrap: 'wrap' }}>
              {others.map((o) => <li key={o.id}><Link className="chip" href={`/formations/${o.slug}`}>{o.title}</Link></li>)}
            </ul>
          </nav>
        </div>

        <aside className="aside" aria-label="Demander un devis">
          {photo ? <div style={{ marginBottom: 'var(--s-4)' }}><Media {...photo} /></div> : null}
          <div className="aside__box">
            <Eyebrow>Un besoin dans ce domaine ?</Eyebrow>
            <strong className="heading heading--3">Recevez une proposition adaptée à votre équipe</strong>
            <Link className="btn btn--primary" href={quote}>Demander un devis</Link>
            <a className="btn btn--secondary" href={whatsappHref(settings.whatsapp, domain.title)} target="_blank" rel="noopener noreferrer"><ChatIcon /> WhatsApp</a>
            <span className="field__hint">Tél. {settings.phone}<br />Formation finançable par le FDFP</span>
          </div>
          <div className="motif motif--band" style={{ marginTop: 'var(--s-4)' }} aria-hidden="true" />
        </aside>
      </div>
      <StickyCta href={quote} label="Demander un devis" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseList) }} />
    </>
  )
}
