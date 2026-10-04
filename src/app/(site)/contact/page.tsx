import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Heading } from '@/components/primitives'
import { ChatIcon } from '@/components/ui/icons'
import { whatsappHref } from '@/components/ui/cta'
import { getSiteSettings } from '@/content/queries/settings'
import { LEAD_TYPES, type LeadType } from '@/lib/lead'
import { ContactForm } from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact et demande de devis | FATIHOUNE',
  description: 'Demandez un devis de formation, une information ou un partenariat. Formulaire, WhatsApp ou téléphone : l’équipe FATIHOUNE vous répond.',
  alternates: { canonical: '/contact' },
}

type Props = { searchParams: Promise<{ type?: string; topic?: string; from?: string }> }

export default async function ContactPage({ searchParams }: Props) {
  const sp = await searchParams
  const settings = await getSiteSettings()
  const type: LeadType = LEAD_TYPES.includes(sp.type as LeadType) ? (sp.type as LeadType) : 'quote'
  const topic = (sp.topic ?? '').slice(0, 200)
  const from = (sp.from ?? 'contact').replace(/[^a-z0-9/-]/gi, '').slice(0, 100) || 'contact'
  const wa = whatsappHref(settings.whatsapp, 'Contact')
  return (
    <>
      <Breadcrumbs items={[{ label: 'Contact' }]} />
      <div className="container" style={{ paddingBlock: 'var(--s-5) var(--section-y)' }}>
        <div className="contact-layout">
          <div className="stack stack--lg">
            <div className="stack">
              <Heading as="h1">Contactez FATIHOUNE</Heading>
              <p className="text text--soft">Une formation, un devis, un partenariat ? Écrivez-nous ou appelez-nous : nous vous répondons{settings.responseDelay ? ` ${settings.responseDelay}` : ' rapidement'}.</p>
              <div className="cluster">
                <a className="btn btn--secondary" href={wa} target="_blank" rel="noopener noreferrer"><ChatIcon /> WhatsApp</a>
                <a className="btn btn--secondary" href={`tel:${settings.phone.replace(/\s/g, '')}`}>Appeler le {settings.phone}</a>
              </div>
            </div>
            <ContactForm initialType={type} initialTopic={topic} sourcePage={from} whatsappUrl={wa} responseDelay={settings.responseDelay} />
          </div>
          <aside aria-label="Nos coordonnées" style={{ marginTop: 'var(--s-6)' }}>
            <div className="aside__box">
              <Heading as="h2" size={3}>Nous joindre</Heading>
              <address style={{ fontStyle: 'normal' }} className="stack stack--sm">
                <span>WhatsApp {settings.whatsappDisplay}</span>
                <span>Tél. <a href={`tel:${settings.phone.replace(/\s/g, '')}`}>{settings.phone}</a></span>
                <a className="link" href={`mailto:${settings.email}`}>{settings.email}</a>
                <span style={{ whiteSpace: 'pre-line' }}>{settings.address}</span>
                {settings.hours ? <span className="field__hint">{settings.hours}</span> : null}
              </address>
              <a className="link" href={`https://www.google.com/maps/search/${encodeURIComponent(settings.address.replace(/\n/g, ' '))}`} target="_blank" rel="noopener noreferrer">Voir sur Google Maps</a>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
