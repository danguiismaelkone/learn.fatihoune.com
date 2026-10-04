import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Eyebrow, Heading, Section } from '@/components/primitives'
import { SearchForm } from '@/components/ui/SearchForm'
import { StickyCta } from '@/components/ui/StickyCta'
import { getSiteSettings } from '@/content/queries/settings'
import { getCertificates, getDomains, getTrainingCounts } from '@/content/queries/trainings'

export const revalidate = 300
export const metadata: Metadata = {
  title: 'Formation continue entreprise Côte d’Ivoire | FATIHOUNE',
  description:
    'Plus de 200 formations pour vos équipes : management, RH, comptabilité, informatique, QHSE… Sur mesure, finançables FDFP. Demandez votre devis.',
  alternates: { canonical: '/formations' },
}

export default async function FormationsPage() {
  const [domains, counts, certificates, settings] = await Promise.all([getDomains(), getTrainingCounts(), getCertificates(), getSiteSettings()])
  const catalog = typeof settings.catalogPdf === 'object' ? settings.catalogPdf : null
  return (
    <>
      <Breadcrumbs items={[{ label: 'Formations' }]} />
      <section className="container hero" aria-labelledby="f-title">
        <div className="motif hero__motif" aria-hidden="true" />
        <div className="stack">
          <Eyebrow>{domains.length} domaines · formation continue</Eyebrow>
          <Heading as="h1" id="f-title">Formation continue pour les entreprises en Côte d’Ivoire</Heading>
          <p className="text text--soft">
            Plus de 200 formations dans {domains.length} domaines, pour vos cadres, vos agents et vos techniciens. Choisissez un domaine, ou
            demandez-nous une formation construite pour votre équipe.
          </p>
          <SearchForm id="q-formations" />
          <div className="cluster"><Link id="primary-cta" className="btn btn--primary" href="/contact?type=quote&from=formations">Demander un devis</Link></div>
        </div>
      </section>
      <Section tone="white" ruled labelledBy="d-title">
        <div className="stack stack--lg">
          <Heading id="d-title">Nos domaines de formation</Heading>
          <ul className="cards">
            {domains.map((d) => {
              const n = counts.get(d.id) ?? 0
              return (
                <li key={d.id}>
                  <Link className="card" href={`/formations/${d.slug}`}>
                    {typeof d.image === 'object' && d.image?.url ? (
                      <div className="card__media">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={d.image.sizes?.card?.url || d.image.url} alt="" width={800} height={450} loading="lazy" decoding="async" />
                      </div>
                    ) : null}
                    <Heading as="h3" size={3}>{d.title}</Heading>
                    <p className="text text--soft">{d.summary}</p>
                    <span className="card__meta"><span>{n} formation{n > 1 ? 's' : ''}</span><span aria-hidden="true">›</span></span>
                  </Link>
                </li>
              )
            })}
            {certificates.length ? (
              <li>
                <Link className="card" href="/certificats">
                  <Heading as="h3" size={3}>Certificats de spécialisation</Heading>
                  <p className="text text--soft">Cinq cycles longs de 100 à 120 heures.</p>
                  <span className="card__meta"><span>{certificates.length} certificats</span><span aria-hidden="true">›</span></span>
                </Link>
              </li>
            ) : null}
          </ul>
        </div>
      </Section>
      <Section>
        <div className="stack stack--lg">
          <div className="stack stack--sm">
            <Heading>Formation sur mesure : nous partons de vos besoins</Heading>
            <p className="text">Votre besoin ne figure pas dans la liste ? Nos experts analysent la situation de votre équipe, puis conçoivent un programme adapté : contenu, durée, lieu et calendrier. Pour chaque formation retenue, vous recevez une fiche technique détaillée.</p>
          </div>
          <div className="stack stack--sm">
            <Heading>En entreprise ou dans nos locaux</Heading>
            <p className="text">Les formations se déroulent dans vos locaux ou dans les nôtres, en journée ou en soirée selon vos contraintes.</p>
          </div>
          <div className="callout stack stack--sm">
            <strong>Votre formation peut être prise en charge par le FDFP.</strong>
            <Link className="link" href="/financement-fdfp">Comprendre le financement FDFP</Link>
          </div>
          <div className="cluster">
            <Link className="btn btn--primary" href="/contact?type=quote&from=formations">Demander un devis</Link>
            {catalog?.url ? <a className="btn btn--secondary" href={catalog.url} download>Télécharger le catalogue (PDF)</a> : null}
          </div>
        </div>
      </Section>
      <StickyCta href="/contact?type=quote&from=formations" label="Demander un devis" />
    </>
  )
}
