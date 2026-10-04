import type { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'
import { getAllPagePaths } from '@/content/queries/pages'
import { getDomains, getPublishedTrainingDetails } from '@/content/queries/trainings'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, domains, details] = await Promise.all([getAllPagePaths(), getDomains(), getPublishedTrainingDetails()])
  const url = (p: string) => new URL(p, siteConfig.url).toString()
  return [
    { url: url('/'), changeFrequency: 'weekly', priority: 1 },
    { url: url('/formations'), changeFrequency: 'weekly', priority: 0.9 },
    ...domains.map((d) => ({ url: url(`/formations/${d.slug}`), lastModified: d.updatedAt, priority: 0.8 })),
    ...details.map((t) => ({ url: url(`/formations/${t.domain.slug}/${t.slug}`), lastModified: t.updatedAt, priority: 0.7 })),
    { url: url('/certificats'), priority: 0.7 },
    { url: url('/references'), priority: 0.7 },
    { url: url('/contact'), priority: 0.6 },
    ...pages.filter((p) => p.path !== 'accueil').map((p) => ({ url: url(`/${p.path}`), lastModified: p.updatedAt, priority: 0.7 })),
  ]
}
