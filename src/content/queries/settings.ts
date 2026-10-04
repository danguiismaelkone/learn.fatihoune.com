import { cache } from 'react'
import { cms } from '@/lib/cms'

export const getSiteSettings = cache(async () => {
  const payload = await cms()
  return payload.findGlobal({ slug: 'site-settings', depth: 1 })
})
