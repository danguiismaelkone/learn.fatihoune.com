import { searchTrainings } from '@/content/queries/search'

/** Instant suggestions for the search dialog: matching domains and the 6 best trainings. */
export async function GET(request: Request) {
  const q = (new URL(request.url).searchParams.get('q') ?? '').slice(0, 80)
  const { total, groups, domains } = await searchTrainings(q, 6)
  const trainings = groups.flatMap((g) =>
    g.items.map((t) => ({ title: t.title, duration: t.duration ?? null, domain: g.domainTitle, href: t.href })),
  )
  return Response.json(
    { total, domains: domains.slice(0, 4), trainings },
    { headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' } },
  )
}
