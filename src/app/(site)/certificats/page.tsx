import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Eyebrow, Heading, Section } from '@/components/primitives'
import { StickyCta } from '@/components/ui/StickyCta'
import { contactHref } from '@/components/ui/cta'
import { getCertificates } from '@/content/queries/trainings'

export const revalidate = 300
export const metadata: Metadata = {
  title: 'Certificats de spécialisation à Abidjan | FATIHOUNE',
  description:
    'GRH, entrepreneuriat, suivi-évaluation, management de projet, ingénierie de formation : cinq cycles longs de 100 à 120 h pour vous spécialiser.',
  alternates: { canonical: '/certificats' },
}

export default async function CertificatesPage() {
  const certificates = await getCertificates()
  return (
    <>
      <Breadcrumbs items={[{ label: 'Formations', href: '/formations' }, { label: 'Certificats' }]} />
      <section className="container hero" aria-labelledby="c-title">
        <div className="motif hero__motif" aria-hidden="true" />
        <div className="stack">
          <Eyebrow>Cycles longs · 100 à 120 heures</Eyebrow>
          <Heading as="h1" id="c-title">Certificats de spécialisation à Abidjan : cinq cycles longs pour devenir expert</Heading>
          <p className="text text--soft">Vous voulez maîtriser un métier en profondeur, pas seulement un outil ? Nos certificats de spécialisation sont des cycles de 100 à 120 heures. Ils donnent une vision complète et approfondie d’une discipline.</p>
          <div><Link id="primary-cta" className="btn btn--primary" href={contactHref('info', 'Certificats de spécialisation', 'certificats')}>Demander des informations</Link></div>
        </div>
      </section>
      <Section tone="white" ruled labelledBy="list">
        <div className="stack stack--lg">
          <Heading id="list">Nos {certificates.length} certificats</Heading>
          <ul className="cards">
            {certificates.map((c) => (
              <li key={c.id}>
                <div className="card">
                  <span className="card__meta" style={{ marginTop: 0 }}><span>{c.code}</span><span>{c.durationHours} h</span></span>
                  <Heading as="h3" size={3}>{c.title}</Heading>
                  <Link className="link" href={contactHref('info', `${c.code} — ${c.title}`, 'certificats')}>Demander des informations<span className="sr-only"> sur {c.title}</span></Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>
      <Section>
        <div className="stack stack--lg">
          <div className="stack stack--sm">
            <Heading>Pour les professionnels, les étudiants et les experts indépendants</Heading>
            <p className="text">Les certificats s’adressent aux salariés qui veulent évoluer, aux étudiants qui veulent se spécialiser avant d’entrer sur le marché du travail, et aux consultants qui veulent renforcer leur expertise.</p>
          </div>
          <div className="stack stack--sm">
            <Heading>En cours du soir, le week-end ou en formule intensive</Heading>
            <p className="text">Choisissez le rythme qui s’adapte à votre emploi du temps : cours du soir, cours le week-end ou formule intensive. À la fin du cycle, vous recevez votre certificat de spécialisation.</p>
          </div>
          <div className="callout stack stack--sm">
            <strong>Votre entreprise peut financer votre certificat</strong>
            <p className="text">Si vous êtes salarié, votre employeur peut inscrire le certificat dans son plan de formation financé par le FDFP.</p>
            <Link className="link" href="/financement-fdfp">Financement FDFP</Link>
          </div>
        </div>
      </Section>
      <StickyCta href={contactHref('info', 'Certificats de spécialisation', 'certificats')} label="Demander des informations" />
    </>
  )
}
