/**
 * Home page, closing logic (2026-10-04): convince → prove → act.
 * - the « professionnalisme » list becomes numbered columns and moves right after « Ce que nous faisons »
 *   (before the FDFP band and the references);
 * - the final « Parlons de vos besoins » block stays last: it now carries the callback form.
 * Idempotent: does nothing when the list already sits before the references block in « pillars » style.
 */
import type { Payload } from 'payload'

export async function applyHomeOrder(payload: Payload) {
  const report: string[] = []
  const home = (await payload.find({ collection: 'pages', where: { path: { equals: 'accueil' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
  if (!home) return report
  const layout = [...((home.layout ?? []) as Record<string, unknown>[])]
  const listAt = layout.findIndex((b) => b.blockType === 'list')
  const cardsAt = layout.findIndex((b) => b.blockType === 'linkCards')
  const refsAt = layout.findIndex((b) => b.blockType === 'referencesTeaser')
  if (listAt < 0) return report

  let changed = false
  if (layout[listAt].style !== 'pillars') {
    layout[listAt] = { ...layout[listAt], style: 'pillars' }
    changed = true
    report.push('arguments en colonnes numérotées')
  }
  if (cardsAt >= 0 && refsAt >= 0 && listAt > refsAt) {
    const [list] = layout.splice(listAt, 1)
    layout.splice(cardsAt + 1, 0, list)
    changed = true
    report.push('arguments déplacés après « Ce que nous faisons »')
  }
  if (changed) await payload.update({ collection: 'pages', id: home.id, overrideAccess: true, data: { layout } as never })
  return report
}
