/**
 * Redirects from the former www.fatihoune.com site (project/2-architecture/redirects.csv).
 * Applied only when a request arrives on the legacy host. One hop, never chained.
 */
export const LEGACY_HOSTS = ['fatihoune.com', 'www.fatihoune.com']

export const LEGACY_REDIRECTS: Record<string, { to?: string; status: 301 | 302 | 410 }> = {
  '/': { to: '/', status: 302 }, // temporary: fatihoune.com will become the group site
  '/about': { to: '/a-propos', status: 301 },
  '/services': { to: '/formations', status: 301 },
  '/services/LEARN': { to: '/formations', status: 301 },
  "/services/DEV'S": { to: '/digitalisation', status: 301 },
  '/services/AGRIC': { status: 410 },
  '/services/Immo': { status: 410 },
  '/services/FOODS': { status: 410 },
  '/services/SANTE': { status: 410 },
  '/realisations': { to: '/references', status: 301 },
  '/realisations/assistance-operationnelle-mission-multi-acteurs': { to: '/references', status: 301 },
  '/realisations/cadrage-strategique-organisation-croissance': { to: '/references', status: 301 },
  '/realisations/renforcement-capacites-equipes-terrain': { to: '/references', status: 301 },
  '/pricing': { to: '/contact', status: 301 },
  '/documents': { to: '/references', status: 301 },
  '/contact': { to: '/contact', status: 301 },
}
