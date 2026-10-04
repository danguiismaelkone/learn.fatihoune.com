/**
 * Loads the lot 5 DRAFT training pages into the CMS, for review in the admin.
 * Run: pnpm seed:drafts — idempotent: only empty fields are filled; existing text is never overwritten.
 * Never ticks « Publier la fiche détaillée »: publication stays an editorial decision.
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import { rich } from './lexical'
import { trainingDrafts } from './training-drafts.data'

const payload = await getPayload({ config })
const log = (msg: string) => payload.logger.info(`[drafts] ${msg}`)
const NOTE = 'Brouillon rédigé à partir de l’intitulé (lot 5). À relire et compléter par le formateur avant de cocher « Publier la fiche détaillée ».'

let filled = 0
const missing: string[] = []
for (const d of trainingDrafts) {
  const { docs } = await payload.find({
    collection: 'trainings',
    where: { and: [{ title: { equals: d.title } }, { 'domain.slug': { equals: d.domain } }] },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const t = docs[0]
  if (!t) {
    missing.push(`${d.domain} › ${d.title}`)
    continue
  }
  const data: Record<string, unknown> = {}
  if (!t.audience?.trim()) data.audience = d.audience
  if (!t.prerequisites?.trim() && d.prerequisites) data.prerequisites = d.prerequisites
  if (!t.objectives) data.objectives = rich(d.objectives)
  if (!t.program) data.program = rich(d.program)
  if (!t.draftNote?.trim()) data.draftNote = NOTE
  if (!t.slug) data.slug = t.title // the slug hook turns the title into a unique address
  if (!Object.keys(data).length) continue
  await payload.update({ collection: 'trainings', id: t.id, data, overrideAccess: true })
  filled++
}
log(`${filled} fiches préparées en brouillon`)
if (missing.length) log(`introuvables (intitulé ou domaine modifié ?) : ${missing.join(' ; ')}`)
process.exit(0)
