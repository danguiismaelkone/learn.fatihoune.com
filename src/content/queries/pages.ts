import { cache } from 'react'
import { cms } from '@/lib/cms'

export const getPageByPath = cache(async (path: string) => {
  const payload = await cms()
  const { docs } = await payload.find({
    collection: 'pages',
    where: { and: [{ status: { equals: 'published' } }, { path: { equals: path } }] },
    limit: 1,
    depth: 1,
    overrideAccess: false,
  })
  return docs[0] ?? null
})

export const getAllPagePaths = cache(async () => {
  const payload = await cms()
  const { docs } = await payload.find({
    collection: 'pages',
    where: { status: { equals: 'published' } },
    limit: 200,
    depth: 0,
    select: { path: true, updatedAt: true },
    overrideAccess: false,
  })
  return docs
})
