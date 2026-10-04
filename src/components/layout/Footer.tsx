import Image from 'next/image'
import Link from 'next/link'
import { getSiteSettings } from '@/content/queries/settings'

const NETWORK_LABELS: Record<string, string> = {
  facebook: 'Facebook', linkedin: 'LinkedIn', instagram: 'Instagram', youtube: 'YouTube', tiktok: 'TikTok', x: 'X',
}

export async function Footer() {
  const s = await getSiteSettings()
  const accreditations = (s.accreditations ?? []).map((a) => a.fullName).join(' · ')
  return (
    <footer className="footer">
      <div className="container footer__cols">
        <div className="stack stack--sm">
          <span className="footer__brand">
            <Image src="/brand/fatihoune-symbol.png" alt="" width={56} height={22} />
            FATIHOUNE
          </span>
          {accreditations ? <span className="footer__muted">{accreditations}</span> : null}
          <address style={{ fontStyle: 'normal' }} className="stack stack--sm">
            <span>Tél. <a href={`tel:${s.phone.replace(/\s/g, '')}`}>{s.phone}</a></span>
            <span>WhatsApp {s.whatsappDisplay}</span>
            <a href={`mailto:${s.email}`}>{s.email}</a>
            <span className="footer__muted" style={{ whiteSpace: 'pre-line' }}>{s.address}</span>
            <a href={`https://www.google.com/maps/search/${encodeURIComponent(s.address.replace(/\n/g, ' '))}`} target="_blank" rel="noopener noreferrer">
              Itinéraire Google Maps
            </a>
            {s.hours ? <span className="footer__muted">{s.hours}</span> : null}
          </address>
        </div>
        <div className="stack stack--sm">
          <h2>Formations</h2>
          <Link href="/formations">Tous les domaines</Link>
          <Link href="/certificats">Certificats</Link>
          <Link href="/digitalisation">Digitalisation</Link>
        </div>
        <div className="stack stack--sm">
          <h2>FATIHOUNE</h2>
          <Link href="/programmes">Programmes</Link>
          <Link href="/financement-fdfp">Financement FDFP</Link>
          <Link href="/references">Références</Link>
          <Link href="/a-propos">Qui sommes-nous</Link>
        </div>
        <div className="stack stack--sm">
          <h2>Informations</h2>
          <Link href="/contact">Contact</Link>
          <Link href="/mentions-legales">Mentions légales</Link>
          <Link href="/confidentialite">Confidentialité</Link>
        </div>
      </div>
      {s.accreditations?.length || s.socials?.length ? (
        <div className="container footer__proof">
          {s.accreditations?.length ? (
            <div className="stack stack--sm">
              <h2>Agréments et réseaux</h2>
              <ul className="proof proof--dark">
                {s.accreditations.map((a) => (
                  <li key={a.id ?? a.name}>{a.name}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {s.socials?.length ? (
            <div className="stack stack--sm">
              <h2>Suivez-nous</h2>
              <ul className="cluster footer__socials">
                {s.socials.map((n) => (
                  <li key={n.id ?? n.url}>
                    <a href={n.url} target="_blank" rel="noopener noreferrer">{NETWORK_LABELS[n.network] ?? n.network}</a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </footer>
  )
}
