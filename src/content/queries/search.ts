import { cache } from 'react'
import { cms } from '@/lib/cms'

export const normalize = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[’']/g, ' ').replace(/[^a-z0-9+#.]+/g, ' ').trim()

type Entry = {
  id: number | string
  title: string
  duration?: string | null
  group?: string | null
  domainTitle: string
  domainSlug: string
  haystack: string
  normTitle: string
}

/** All published trainings, flattened once per request for in-memory search (≈ 360 rows). */
const getSearchIndex = cache(async (): Promise<Entry[]> => {
  const payload = await cms()
  const { docs } = await payload.find({
    collection: 'trainings',
    where: { status: { equals: 'published' } },
    limit: 2000,
    depth: 1,
    overrideAccess: false,
    select: { title: true, durationLabel: true, group: true, domain: true },
  })
  return docs
    .filter((t) => typeof t.domain === 'object' && t.domain?.status === 'published')
    .map((t) => {
      const d = t.domain as { title: string; slug: string }
      return {
        id: t.id,
        title: t.title,
        duration: t.durationLabel,
        group: t.group,
        domainTitle: d.title,
        domainSlug: d.slug,
        normTitle: normalize(t.title),
        haystack: normalize(`${t.title} ${t.group ?? ''}`),
      }
    })
})

const STOPWORDS = new Set(['de', 'la', 'le', 'les', 'des', 'du', 'et', 'en', 'au', 'aux', 'pour', 'sur', 'un', 'une', 'formation', 'formations'])

export type SearchResult = { domainTitle: string; domainSlug: string; items: Entry[] }

/** Every word of the query must appear (accents and case ignored). Title matches rank first. */
export async function searchTrainings(query: string, limit = 60) {
  const terms = normalize(query).split(' ').filter((w) => w.length >= 2 && !STOPWORDS.has(w))
  if (!terms.length) return { total: 0, groups: [] as SearchResult[], domains: [] as { title: string; slug: string }[] }
  const index = await getSearchIndex()
  // Domains whose name matches the query are offered as a shortcut, without flooding the list with all their trainings.
  const domains = [...new Map(index.map((e) => [e.domainSlug, { title: e.domainTitle, slug: e.domainSlug }])).values()]
    .filter((d) => terms.every((t) => normalize(d.title).includes(t)))
  const scored = index
    .filter((e) => terms.every((t) => e.haystack.includes(t)))
    .map((e) => ({
      e,
      score: terms.reduce((s, t) => s + (e.normTitle.includes(t) ? 3 : 1) + (e.normTitle.startsWith(t) ? 2 : 0), 0),
    }))
    .sort((a, b) => b.score - a.score || a.e.title.localeCompare(b.e.title, 'fr'))
  const total = scored.length
  const groups = new Map<string, SearchResult>()
  for (const { e } of scored.slice(0, limit)) {
    if (!groups.has(e.domainSlug)) groups.set(e.domainSlug, { domainTitle: e.domainTitle, domainSlug: e.domainSlug, items: [] })
    groups.get(e.domainSlug)!.items.push(e)
  }
  return { total, groups: [...groups.values()], domains }
}
