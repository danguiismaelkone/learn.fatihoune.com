import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload'

/** Refreshes the public site as soon as an editor saves, instead of waiting for the 5-minute cache. */
function refreshSite(logger: { debug: (o: object) => void }, context?: Record<string, unknown>) {
  if (context?.skipRevalidate) return
  try {
    revalidatePath('/', 'layout')
  } catch (error) {
    // Outside a Next.js request (e.g. the seed script) there is nothing to revalidate.
    logger.debug({ msg: 'revalidatePath skipped', err: (error as Error).message })
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = ({ doc, req, context }) => {
  refreshSite(req.payload.logger, context)
  return doc
}

export const revalidateGlobal: GlobalAfterChangeHook = ({ doc, req, context }) => {
  refreshSite(req.payload.logger, context)
  return doc
}
