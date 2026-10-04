import { cache } from 'react'
import { cms } from '@/lib/cms'

export const REFERENCE_CATEGORIES = [
  { value: 'ministry', label: 'Ministères et services de l’État', short: 'Ministères' },
  { value: 'agency', label: 'Agences et institutions', short: 'Agences' },
  { value: 'local', label: 'Collectivités', short: 'Collectivités' },
  { value: 'international', label: 'Partenaires internationaux et réseaux', short: 'International' },
  { value: 'association', label: 'Associations et coopératives', short: 'Associations' },
] as const

/** Only citable references — the filter lives here, never in the page. */
export const getCitableReferences = cache(async (opts: { programPartnersOnly?: boolean } = {}) => {
  const payload = await cms()
  const { docs } = await payload.find({
    collection: 'references',
    where: {
      and: [
        { canBeCited: { equals: true } },
        ...(opts.programPartnersOnly ? [{ isProgramPartner: { equals: true } }] : []),
      ],
    },
    sort: 'order',
    limit: 200,
    depth: 1,
    overrideAccess: false,
  })
  return docs
})
