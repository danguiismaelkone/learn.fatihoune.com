/**
 * Applies the « Solutions / Vous êtes / search » content to a database. Idempotent:
 * - creates the missing pages only (their content is never overwritten); with `publish`, drafts of these pages are published;
 * - fills popular searches and the featured solution only when they are empty;
 * - inserts the Digitalisation highlight on the home page only if no block links to /digitalisation yet.
 * New pages are created as drafts unless `publish` is true.
 */
import type { Payload } from 'payload'
import { digitalisationHighlight, navigationPages, navigationSettings } from './navigation-pages'

const photoId = async (payload: Payload, key: string) => {
  const filename = `${key.replace('/', '-')}.jpg`
  const { docs } = await payload.find({ collection: 'media', where: { filename: { equals: filename } }, limit: 1, depth: 0, overrideAccess: true })
  return docs[0]?.id
}

export async function applyNavigation(payload: Payload, { publish }: { publish: boolean }) {
  const report: string[] = []

  for (const { imageKey, ...page } of navigationPages) {
    const existing = await payload.find({ collection: 'pages', where: { path: { equals: page.path } }, limit: 1, depth: 0, overrideAccess: true })
    if (existing.docs.length) {
      const doc = existing.docs[0]
      if (publish && doc.status !== 'published') {
        await payload.update({ collection: 'pages', id: doc.id, overrideAccess: true, data: { status: 'published' } })
        report.push(`page /${page.path} publiée`)
      }
      continue
    }
    const image = await photoId(payload, imageKey)
    const layout = page.layout.map((b, i) => (i === 0 && b.blockType === 'hero' && image ? { ...b, image } : b))
    await payload.create({ collection: 'pages', overrideAccess: true, data: { ...page, layout, status: publish ? 'published' : 'draft' } as never })
    report.push(`page /${page.path} (${publish ? 'publiée' : 'brouillon'})`)
  }

  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0, overrideAccess: true })
  const data: Record<string, unknown> = {}
  if (!settings.popularSearches?.length) data.popularSearches = navigationSettings.popularSearches.map((term) => ({ term }))
  if (!settings.featuredSolution?.title) {
    const { imageKey, ...featured } = navigationSettings.featuredSolution
    data.featuredSolution = { ...featured, image: await photoId(payload, imageKey) }
  }
  if (Object.keys(data).length) {
    await payload.updateGlobal({ slug: 'site-settings', overrideAccess: true, data })
    report.push(`réglages : ${Object.keys(data).join(', ')}`)
  }

  const home = (await payload.find({ collection: 'pages', where: { path: { equals: 'accueil' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
  if (home) {
    const layout = (home.layout ?? []) as Record<string, unknown>[]
    const linksToDigitalisation = JSON.stringify(layout.filter((b) => b.blockType === 'hero')).includes('/digitalisation')
    if (!linksToDigitalisation) {
      const { imageKey, ...block } = digitalisationHighlight
      const at = layout.findIndex((b) => b.blockType === 'domainIndex')
      const next = [...layout]
      next.splice(at >= 0 ? at + 1 : next.length, 0, { ...block, image: await photoId(payload, imageKey) })
      await payload.update({ collection: 'pages', id: home.id, overrideAccess: true, data: { layout: next } as never })
      report.push('accueil : bandeau Digitalisation ajouté après les domaines')
    }
  }
  return report
}
