import { cache } from 'react'
import { cms } from '@/lib/cms'
import type { Training, TrainingDomain } from '@/payload-types'

const published = { status: { equals: 'published' } } as const

export const getDomains = cache(async () => {
  const payload = await cms()
  const { docs } = await payload.find({
    collection: 'training-domains',
    where: published,
    sort: 'order',
    limit: 50,
    depth: 1,
    overrideAccess: false,
  })
  return docs
})

/** Number of published trainings per domain id — used on cards and index rows. */
export const getTrainingCounts = cache(async () => {
  const payload = await cms()
  const { docs } = await payload.find({
    collection: 'trainings',
    where: published,
    limit: 2000,
    depth: 0,
    select: { domain: true },
    overrideAccess: false,
  })
  const counts = new Map<number | string, number>()
  for (const t of docs) {
    const id = typeof t.domain === 'object' ? t.domain.id : t.domain
    counts.set(id, (counts.get(id) ?? 0) + 1)
  }
  return counts
})

/** Trainings tagged « Très demandée », for the home page. Domain is populated for links. */
export const getPopularTrainings = cache(async (limit = 6) => {
  const payload = await cms()
  const { docs } = await payload.find({
    collection: 'trainings',
    where: { and: [published, { badges: { in: ['popular'] } }] },
    sort: 'order',
    limit,
    depth: 2, // domain and its photo, used on the home page cards
    overrideAccess: false,
  })
  return docs.filter((t) => typeof t.domain === 'object' && t.domain.status === 'published')
})

/** Trainings whose detailed page is published, with their domain — for static params and the sitemap. */
export const getPublishedTrainingDetails = cache(async () => {
  const payload = await cms()
  const { docs } = await payload.find({
    collection: 'trainings',
    where: { and: [published, { detailPublished: { equals: true } }] },
    limit: 500,
    depth: 1,
    overrideAccess: false,
  })
  return docs.filter((t): t is Training & { domain: TrainingDomain; slug: string } =>
    Boolean(t.slug) && typeof t.domain === 'object' && t.domain.status === 'published')
})

export const getTrainingDetail = cache(async (domainSlug: string, slug: string) => {
  const payload = await cms()
  const { docs } = await payload.find({
    collection: 'trainings',
    where: { and: [published, { detailPublished: { equals: true } }, { slug: { equals: slug } }] },
    limit: 1,
    depth: 1,
    overrideAccess: false,
  })
  const t = docs[0]
  if (!t || typeof t.domain !== 'object' || t.domain.slug !== domainSlug || t.domain.status !== 'published') return null
  return t as Training & { domain: TrainingDomain }
})

export const getDomainBySlug = cache(async (slug: string) => {
  const payload = await cms()
  const { docs } = await payload.find({
    collection: 'training-domains',
    where: { and: [published, { slug: { equals: slug } }] },
    limit: 1,
    depth: 1,
    overrideAccess: false,
  })
  return (docs[0] as TrainingDomain | undefined) ?? null
})

export type TrainingGroup = { title: string; items: Training[] }

/** Trainings of a domain, grouped in the order defined on the domain. */
export const getDomainTrainings = cache(async (domain: TrainingDomain): Promise<TrainingGroup[]> => {
  const payload = await cms()
  const { docs } = await payload.find({
    collection: 'trainings',
    where: { and: [published, { domain: { equals: domain.id } }] },
    sort: 'order',
    limit: 1000,
    depth: 0,
    overrideAccess: false,
  })
  const order = (domain.groups ?? []).map((g) => g.title)
  const groups = new Map<string, Training[]>(order.map((title) => [title, []]))
  for (const t of docs) {
    const key = t.group && groups.has(t.group) ? t.group : 'Autres formations'
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(t)
  }
  return [...groups.entries()].filter(([, items]) => items.length).map(([title, items]) => ({ title, items }))
})

export const getCertificates = cache(async () => {
  const payload = await cms()
  const { docs } = await payload.find({
    collection: 'certificates',
    where: published,
    sort: 'order',
    limit: 50,
    depth: 0,
    overrideAccess: false,
  })
  return docs
})
