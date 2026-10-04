import type { Metadata, Viewport } from 'next'
import { Arimo } from 'next/font/google'
import type { ReactNode } from 'react'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { Callback } from '@/components/ui/Callback'
import { ChatIcon } from '@/components/ui/icons'
import { BackToTop } from '@/components/ui/ScrollAids'
import { whatsappHref } from '@/components/ui/cta'
import { isProduction, siteConfig } from '@/config/site'
import { getSiteSettings } from '@/content/queries/settings'
import './site.css'

// Arimo is metric-compatible with Arial: only devices without Arial (most Android phones) download it.
const arimo = Arimo({ subsets: ['latin'], weight: ['400', '700'], display: 'swap', preload: false, variable: '--font-arimo' })

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: 'Cabinet de formation à Abidjan habilité FDFP | FATIHOUNE', template: '%s' },
  description:
    'Formations pour entreprises, accompagnement au numérique et programmes d’insertion. Cabinet habilité FDFP à Abidjan. Demandez votre devis en ligne.',
  openGraph: { type: 'website', locale: siteConfig.locale, siteName: 'FATIHOUNE Formation' },
  robots: isProduction() ? { index: true, follow: true } : { index: false, follow: false },
}

export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#FFFFFF' }

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings()
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: siteConfig.legalName,
    url: siteConfig.url,
    logo: new URL('/brand/fatihoune-symbol-1200.png', siteConfig.url).toString(),
    email: settings.email,
    telephone: settings.phone,
    address: { '@type': 'PostalAddress', streetAddress: settings.address, addressLocality: 'Abidjan', addressCountry: 'CI' },
  }
  return (
    <html lang="fr" className={arimo.variable}>
      <body>
        <a className="skip" href="#contenu">Aller au contenu</a>
        <Header />
        <main id="contenu" tabIndex={-1}>
          {children}
        </main>
        <Callback whatsappUrl={whatsappHref(settings.whatsapp)} />
        <Footer />
        <BackToTop />
        <a
          className="wa-float"
          href={whatsappHref(settings.whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Écrire à FATIHOUNE sur WhatsApp"
        >
          <ChatIcon className="" />
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </body>
    </html>
  )
}
