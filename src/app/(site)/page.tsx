import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { StickyCta } from '@/components/ui/StickyCta'
import { getPageByPath } from '@/content/queries/pages'
import { getSiteSettings } from '@/content/queries/settings'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageByPath('accueil')
  return {
    title: page?.seo?.title || undefined,
    description: page?.seo?.description || undefined,
    alternates: { canonical: '/' },
  }
}

export default async function HomePage() {
  const [page, settings] = await Promise.all([getPageByPath('accueil'), getSiteSettings()])
  if (!page) notFound()
  return (
    <>
      <RenderBlocks blocks={page.layout} ctx={{ settings, pageTitle: 'Accueil', from: 'accueil' }} />
      <StickyCta href="/contact?type=quote&from=accueil" label="Demander un devis" />
    </>
  )
}
