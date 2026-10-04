export const siteConfig = {
  name: 'FATIHOUNE',
  legalName: 'FATIHOUNE SARL',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  /** 'production' only on formation.fatihoune.com; anything else is noindex + password-protected. */
  env: process.env.SITE_ENV || 'development',
  locale: 'fr_CI',
}

export const isProduction = () => siteConfig.env === 'production'

export const mainNav = [
  { href: '/formations', label: 'Formations' },
  { href: '/digitalisation', label: 'Digitalisation' },
  { href: '/programmes', label: 'Programmes' },
  { href: '/financement-fdfp', label: 'Financement FDFP' },
  { href: '/references', label: 'Références' },
  { href: '/contact', label: 'Contact' },
]
