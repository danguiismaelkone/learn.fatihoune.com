import Link from 'next/link'
import { Heading, Section } from '@/components/primitives'
import type { SiteSetting } from '@/payload-types'

/** « Où nous trouver » — address, hours and directions, read from the site settings. No embedded map. */
export function Visit({ settings }: { settings: SiteSetting }) {
  if (!settings.address) return null
  const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(settings.address.replace(/\n/g, ' '))}`
  return (
    <Section tone="white" ruled labelledBy="visit-title">
      <div className="visit">
        <Heading id="visit-title">Où nous trouver</Heading>
        <address className="visit__card">
          <span className="visit__address">{settings.address}</span>
          {settings.hours ? <span className="text--soft">Horaires : {settings.hours}</span> : null}
          <span>Tél. <a className="link" href={`tel:${settings.phone.replace(/\s/g, '')}`}>{settings.phone}</a></span>
          <span className="cluster">
            <a className="btn btn--secondary btn--compact" href={mapsUrl} target="_blank" rel="noopener noreferrer">Itinéraire Google Maps</a>
            <Link className="link" href="/contact">Prendre rendez-vous</Link>
          </span>
        </address>
      </div>
    </Section>
  )
}
