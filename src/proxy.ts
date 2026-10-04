import { NextResponse, type NextRequest } from 'next/server'
import { LEGACY_HOSTS, LEGACY_REDIRECTS } from './config/legacy-redirects'

const TARGET = process.env.NEXT_PUBLIC_SITE_URL || 'https://formation.fatihoune.com'

export function proxy(req: NextRequest) {
  const host = (req.headers.get('host') ?? '').split(':')[0].toLowerCase()

  // 1. Legacy domain: one-hop redirects from the old site's URLs.
  if (LEGACY_HOSTS.includes(host)) {
    const path = decodeURIComponent(req.nextUrl.pathname)
    const rule = LEGACY_REDIRECTS[path] ?? LEGACY_REDIRECTS[path.replace(/\/$/, '')]
    if (rule?.status === 410) return new NextResponse('Cette page n’existe plus.', { status: 410 })
    return NextResponse.redirect(new URL(rule?.to ?? '/', TARGET), rule?.status ?? 302)
  }

  // 2. Pre-production: password-protected and never indexed. Production is the only public environment.
  if (process.env.SITE_ENV !== 'production') {
    const user = process.env.PREVIEW_USER
    const pass = process.env.PREVIEW_PASSWORD
    const isAdminOrApi = req.nextUrl.pathname.startsWith('/admin') || req.nextUrl.pathname.startsWith('/api')
    if (user && pass && !isAdminOrApi) {
      const expected = 'Basic ' + btoa(`${user}:${pass}`)
      if (req.headers.get('authorization') !== expected) {
        return new NextResponse('Accès réservé (préproduction).', {
          status: 401,
          headers: { 'WWW-Authenticate': 'Basic realm="Preproduction FATIHOUNE", charset="UTF-8"', 'X-Robots-Tag': 'noindex, nofollow' },
        })
      }
    }
    const res = NextResponse.next()
    res.headers.set('X-Robots-Tag', 'noindex, nofollow')
    return res
  }
  return NextResponse.next()
}

export const config = { matcher: ['/((?!_next/static|_next/image|brand/|favicon.ico|icon.png|healthz).*)'] }
