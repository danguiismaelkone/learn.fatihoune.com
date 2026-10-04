import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Breadcrumbs, type Crumb } from '@/components/layout/Breadcrumbs'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { StickyCta } from '@/components/ui/StickyCta'
import { contactHref } from '@/components/ui/cta'
import { getAllPagePaths, getPageByPath } from '@/content/queries/pages'
import { getSiteSettings } from '@/content/queries/settings'

export const revalidate = 300
type Props = { params: Promise<{ path: string[] }> }

export async function generateStaticParams() {
  const pages = await getAllPagePaths()
  return pages.filter((p) => p.path !== 'accueil').map((p) => ({ path: p.path.split('/') }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { path } = await params
  const page = await getPageByPath(path.join('/'))
  if (!page) return {}
  return {
    title: page.seo?.title || `${page.title} | FATIHOUNE`,
    description: page.seo?.description || undefined,
    alternates: { canonical: `/${page.path}` },
  }
}

const STICKY = {
  quote: { type: 'quote', label: 'Demander un devis' },
  info: { type: 'info', label: 'Demander des informations' },
  partnership: { type: 'partnership', label: 'Proposer un partenariat' },
} as const

export default async function ContentPage({ params }: Props) {
  const { path } = await params
  const joined = path.join('/')
  if (joined === 'accueil') notFound()
  const [page, settings] = await Promise.all([getPageByPath(joined), getSiteSettings()])
  if (!page) notFound()
  const crumbs: Crumb[] = page.parentLabel === 'programmes' ? [{ label: 'Programmes', href: '/programmes' }, { label: page.title }] : [{ label: page.title }]
  const sticky = page.stickyCta && page.stickyCta !== 'none' ? STICKY[page.stickyCta] : null
  return (
    <>
      <Breadcrumbs items={crumbs} />
      <RenderBlocks blocks={page.layout} ctx={{ settings, pageTitle: page.title, from: page.path }} />
      {sticky ? <StickyCta href={contactHref(sticky.type, null, page.path)} label={sticky.label} /> : null}
    </>
  )
}
