import { cms } from '@/lib/cms'

export const dynamic = 'force-dynamic'

/** Liveness + database check for the container healthcheck and uptime monitoring. Excluded from the pre-production password. */
export async function GET() {
  try {
    const payload = await cms()
    await payload.count({ collection: 'training-domains', overrideAccess: true })
    return Response.json({ status: 'ok' }, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return Response.json({ status: 'error' }, { status: 503, headers: { 'Cache-Control': 'no-store' } })
  }
}
