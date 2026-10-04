export const siteConfig = {
  name: 'FATIHOUNE',
  legalName: 'FATIHOUNE SARL',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  /** 'production' only on formation.fatihoune.com; anything else is noindex + password-protected. */
  env: process.env.SITE_ENV || 'development',
  locale: 'fr_CI',
}

export const isProduction = () => siteConfig.env === 'production'

export type NavLink = {
  href: string
  label: string
  hint?: string
  /** CMS page the link depends on: the link is hidden until that page is published. */
  page?: string
}

/** « Solutions » menu (Cegos-style). Digitalisation is also featured in the panel (site settings). */
export const solutionsNav: NavLink[] = [
  { href: '/digitalisation', label: 'Digitalisation des PME', hint: 'Audit, choix des outils, formation des équipes', page: 'digitalisation' },
  { href: '/formations#sur-mesure', label: 'Formation sur mesure en entreprise', hint: 'Un programme conçu pour votre équipe' },
  { href: '/solutions/formation-inter-entreprises', label: 'Formation inter-entreprises', hint: 'Sessions ouvertes à plusieurs entreprises', page: 'solutions/formation-inter-entreprises' },
  { href: '/certificats', label: 'Certificats de spécialisation', hint: 'Cycles longs de 100 à 120 heures' },
  { href: '/programmes', label: 'Programmes d’insertion et d’entrepreneuriat', hint: 'Jeunes, porteurs de projet, femmes', page: 'programmes' },
]

/** « Vous êtes » menu: one landing page per audience. */
export const audienceNav: NavLink[] = [
  { href: '/vous-etes/entreprise', label: 'Une entreprise', hint: 'Former et faire progresser vos équipes', page: 'vous-etes/entreprise' },
  { href: '/vous-etes/pme', label: 'Une PME ou une TPE', hint: 'Digitaliser, former, faire financer', page: 'vous-etes/pme' },
  { href: '/vous-etes/institution', label: 'Une institution ou un partenaire', hint: 'Programmes de formation et d’insertion', page: 'vous-etes/institution' },
  { href: '/vous-etes/particulier', label: 'Un particulier ou un jeune diplômé', hint: 'Certificats, insertion, création d’entreprise', page: 'vous-etes/particulier' },
]

/** Plain links of the main menu, after the three drop-downs (Formations, Solutions, Vous êtes). */
export const mainNav: NavLink[] = [
  { href: '/financement-fdfp', label: 'Financement FDFP' },
  { href: '/references', label: 'Références' },
  { href: '/contact', label: 'Contact' },
]

/** Keeps the links whose CMS page is published (links without `page` always stay). */
export const visibleLinks = (links: NavLink[], publishedPaths: Set<string>) =>
  links.filter((l) => !l.page || publishedPaths.has(l.page))
