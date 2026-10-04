import type { MetadataRoute } from 'next'
import { isProduction, siteConfig } from '@/config/site'

export default function robots(): MetadataRoute.Robots {
  if (!isProduction()) return { rules: { userAgent: '*', disallow: '/' } }
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] },
    sitemap: new URL('/sitemap.xml', siteConfig.url).toString(),
  }
}
