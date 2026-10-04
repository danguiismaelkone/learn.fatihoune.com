/**
 * Home page, proposal A (2026-10-04): « Ce que nous faisons pour vous » as photo cards and the FDFP
 * callout as a compact red band. Idempotent and conservative:
 * - converts the « doors » link-cards block only if it is still in « doors » style;
 * - adds a photo / link label to a card only when the field is empty;
 * - replaces the FDFP callout text block only if it is still there.
 */
import type { Payload } from 'payload'

/** Card link → photo key (images.json) and link label. */
const CARDS: Record<string, { imageKey: string; linkLabel: string }> = {
  '/formations': { imageKey: 'management', linkLabel: 'Voir les formations' },
  '/digitalisation': { imageKey: 'digitalisation', linkLabel: 'Découvrir la digitalisation' },
  '/programmes': { imageKey: 'programmes', linkLabel: 'Voir les programmes' },
}

export const FDFP_BAND = {
  blockType: 'demand',
  style: 'band',
  title: 'Votre formation peut être financée par le FDFP',
  text: 'Cabinet habilité par le FDFP, nous vous aidons à monter votre dossier pour que vos formations soient prises en charge.',
  buttons: [{ label: 'Comment ça marche', kind: 'link', href: '/financement-fdfp' }],
}

const photoId = async (payload: Payload, key: string) => {
  const { docs } = await payload.find({ collection: 'media', where: { filename: { equals: `${key.replace('/', '-')}.jpg` } }, limit: 1, depth: 0, overrideAccess: true })
  return docs[0]?.id
}

export async function applyHomeCards(payload: Payload) {
  const report: string[] = []
  const home = (await payload.find({ collection: 'pages', where: { path: { equals: 'accueil' } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
  if (!home) return report
  const layout = [...((home.layout ?? []) as Record<string, unknown>[])]
  let changed = false

  for (const [i, block] of layout.entries()) {
    if (block.blockType === 'linkCards' && block.style === 'doors') {
      const items = await Promise.all(
        ((block.items ?? []) as Record<string, unknown>[]).map(async (item) => {
          const preset = CARDS[String(item.href)]
          if (!preset) return item
          return {
            ...item,
            linkLabel: item.linkLabel || preset.linkLabel,
            image: item.image || (await photoId(payload, preset.imageKey)),
          }
        }),
      )
      layout[i] = { ...block, style: 'photo', items }
      changed = true
      report.push('« Ce que nous faisons pour vous » en cartes avec photo')
    }
    if (block.blockType === 'text' && block.tone === 'callout' && String(block.title ?? '').includes('financée par le FDFP')) {
      layout[i] = { ...FDFP_BAND }
      changed = true
      report.push('encadré FDFP remplacé par un bandeau rouge')
    }
  }

  if (changed) await payload.update({ collection: 'pages', id: home.id, overrideAccess: true, data: { layout } as never })
  return report
}
