import Image from 'next/image'
import Link from 'next/link'
import { getSiteSettings } from '@/content/queries/settings'

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
    </footer>
  )
}
