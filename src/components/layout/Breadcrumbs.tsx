import Link from 'next/link'
import { siteConfig } from '@/config/site'

export type Crumb = { label: string; href?: string }

export function Breadcrumbs({ items, tone }: { items: Crumb[]; tone?: 'dark' }) {
  const all: Crumb[] = [{ label: 'Accueil', href: '/' }, ...items]
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: all.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: new URL(c.href, siteConfig.url).toString() } : {}),
    })),
  }
  return (
    <nav className={`container crumbs${tone ? ` crumbs--${tone}` : ''}`} aria-label="Fil d’Ariane">
      <ol>
        {all.map((c, i) => (
          <li key={i}>{c.href && i < all.length - 1 ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}</li>
        ))}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </nav>
  )
}
