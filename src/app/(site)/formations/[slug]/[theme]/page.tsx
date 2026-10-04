import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Eyebrow, Heading, Media, mediaFromDoc } from '@/components/primitives'
import { ChatIcon } from '@/components/ui/icons'
import { RichText } from '@/components/ui/RichText'
import { StickyCta } from '@/components/ui/StickyCta'
import { contactHref, whatsappHref } from '@/components/ui/cta'
import { siteConfig } from '@/config/site'
import { getSiteSettings } from '@/content/queries/settings'
import { getPublishedTrainingDetails, getTrainingDetail } from '@/content/queries/trainings'
import { TRAINING_BADGE_LABELS, type TrainingBadge } from '@/lib/training'
import type { Media as MediaDoc } from '@/payload-types'

export const revalidate = 300
type Props = { params: Promise<{ slug: string; theme: string }> }

export async function generateStaticParams() {
  return (await getPublishedTrainingDetails()).map((t) => ({ slug: t.domain.slug, theme: t.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, theme } = await params
  const t = await getTrainingDetail(slug, theme)
  if (!t) return {}
  return {
    title: `Formation ${t.title} à Abidjan | FATIHOUNE`,
    description: `${t.title} : public, objectifs et programme. Formation ${t.domain.title.toLowerCase()} en entreprise ou chez FATIHOUNE, finançable par le FDFP.`.slice(0, 160),
    alternates: { canonical: `/formations/${t.domain.slug}/${t.slug}` },
  }
}

const SECTIONS = [
  { id: 'pour-qui', label: 'Pour qui' },
  { id: 'objectifs', label: 'Objectifs' },
  { id: 'programme', label: 'Programme' },
  { id: 'pedagogie', label: 'Pédagogie' },
  { id: 'financement', label: 'Financement FDFP' },
] as const

export default async function TrainingPage({ params }: Props) {
  const { slug, theme } = await params
  const t = await getTrainingDetail(slug, theme)
  if (!t) notFound()
  const settings = await getSiteSettings()
  const domain = t.domain
  const from = `formations/${domain.slug}/${t.slug}`
  const quote = contactHref('quote', `${domain.title} › ${t.title}`, from)

  const photo = mediaFromDoc(typeof t.image === 'object' ? (t.image as MediaDoc | null) : null, '(min-width: 1024px) 33vw, 100vw')

  const practical = (
    <dl className="info__list">
      {t.durationLabel ? (<><dt>Durée</dt><dd>{t.durationLabel}</dd></>) : null}
      <dt>Lieu</dt><dd>Dans vos locaux ou chez FATIHOUNE</dd>
      <dt>Format</dt><dd>Sur mesure, pour votre équipe</dd>
      <dt>Tarif</dt><dd>Sur devis</dd>
      <dt>Financement</dt><dd>Finançable par le FDFP</dd>
    </dl>
  )

  const course = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: t.title,
    description: t.audience ?? `${t.title} — formation ${domain.title.toLowerCase()} par FATIHOUNE.`,
    url: new URL(`/formations/${domain.slug}/${t.slug}`, siteConfig.url).toString(),
    provider: { '@type': 'Organization', name: 'FATIHOUNE', sameAs: siteConfig.url },
    ...(t.durationHours ? { timeRequired: `PT${t.durationHours}H` } : {}),
    inLanguage: 'fr',
  }

  return (
    <>
      <div className="domain-banner">
        <Breadcrumbs
          tone="dark"
          items={[{ label: 'Formations', href: '/formations' }, { label: domain.title, href: `/formations/${domain.slug}` }, { label: t.title }]}
        />
        <div className="container domain-banner__inner">
          <Eyebrow>Formation · {domain.title}</Eyebrow>
          <Heading as="h1">{t.title}</Heading>
          {t.badges?.length ? (
            <p className="cluster">
              {t.badges.map((b) => <span key={b} className="badge badge--light">{TRAINING_BADGE_LABELS[b as TrainingBadge]}</span>)}
            </p>
          ) : null}
        </div>
        <div className="motif domain-banner__band" aria-hidden="true" />
      </div>

      <nav className="tabs" aria-label="Sections de la fiche">
        <ul className="container tabs__list">
          {SECTIONS.map((s) => <li key={s.id}><a href={`#${s.id}`}>{s.label}</a></li>)}
          <li><a href="#demande">Demande</a></li>
        </ul>
      </nav>

      <div className="container with-aside with-tabs">
        <div className="stack stack--lg fiche" style={{ minWidth: 0 }}>
          {/* The aside is hidden below 1024 px: practical info is repeated at the top on mobile. */}
          <div className="only-mobile aside__box info" aria-label="Informations pratiques">{practical}</div>
          <section id="pour-qui" className="fiche__section" aria-labelledby="h-pour-qui">
            <Heading id="h-pour-qui">Pour qui</Heading>
            <p className="text" style={{ whiteSpace: 'pre-line' }}>{t.audience}</p>
            <h3 className="heading heading--3" style={{ marginTop: 'var(--s-2)' }}>Prérequis</h3>
            <p className="text" style={{ whiteSpace: 'pre-line' }}>{t.prerequisites?.trim() || 'Aucun prérequis.'}</p>
          </section>

          <section id="objectifs" className="fiche__section" aria-labelledby="h-objectifs">
            <Heading id="h-objectifs">Objectifs</Heading>
            <RichText data={t.objectives} />
          </section>

          <section id="programme" className="fiche__section" aria-labelledby="h-programme">
            <Heading id="h-programme">Programme</Heading>
            <RichText data={t.program} />
          </section>

          <section id="pedagogie" className="fiche__section" aria-labelledby="h-pedagogie">
            <Heading id="h-pedagogie">Pédagogie</Heading>
            <p className="text">
              Le programme est adapté à votre secteur et à vos cas réels. Vous recevez une fiche technique détaillée pour la formation retenue.
              La formation a lieu dans vos locaux ou dans les nôtres.
            </p>
          </section>

          <section id="financement" className="fiche__section" aria-labelledby="h-financement">
            <Heading id="h-financement">Financement FDFP</Heading>
            <p className="text">
              FATIHOUNE est un cabinet habilité par le FDFP : si votre entreprise est à jour de ses cotisations, cette formation peut être financée.
              Si vous le souhaitez, nous vous aidons à préparer le dossier. <Link className="link" href="/financement-fdfp">Comment ça marche</Link>
            </p>
          </section>

          <section id="demande" className="fiche__section callout stack stack--sm" aria-labelledby="h-demande">
            <Heading id="h-demande" size={3}>Organiser cette formation pour votre équipe</Heading>
            <p className="text">Indiquez votre effectif et vos contraintes : nous vous envoyons une proposition adaptée.</p>
            <div className="cluster">
              <Link id="primary-cta" className="btn btn--primary" href={quote}>Demander un devis</Link>
              <Link className="link" href={`/formations/${domain.slug}`}>Toutes les formations {domain.title.toLowerCase()}</Link>
            </div>
          </section>
        </div>

        <aside className="aside" aria-label="Informations pratiques">
          {photo ? <div style={{ marginBottom: 'var(--s-4)' }}><Media {...photo} /></div> : null}
          <div className="aside__box info">
            <Eyebrow>Informations pratiques</Eyebrow>
            {practical}
            <Link className="btn btn--primary" href={quote}>Demander un devis</Link>
            <a className="btn btn--secondary" href={whatsappHref(settings.whatsapp, t.title)} target="_blank" rel="noopener noreferrer"><ChatIcon /> WhatsApp</a>
            <span className="field__hint">Tél. {settings.phone}</span>
          </div>
          <div className="motif motif--band" style={{ marginTop: 'var(--s-4)' }} aria-hidden="true" />
        </aside>
      </div>
      <StickyCta href={quote} label="Demander un devis" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(course) }} />
    </>
  )
}
