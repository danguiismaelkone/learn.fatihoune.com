/**
 * Seeds the database with the validated content (project/3-content).
 * Run: pnpm seed   — idempotent: existing documents (same slug/path/code/name) are updated, not duplicated.
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import domains from './domains.json' with { type: 'json' }
import { pages } from './pages'
import { applyHomeCards } from './home-cards'
import { applyNavigation } from './navigation'
import { rich } from './lexical'
import images from './images.json' with { type: 'json' }
import path from 'path'
import { fileURLToPath } from 'url'

const imagesDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'images')

const payload = await getPayload({ config })
const log = (msg: string) => payload.logger.info(`[seed] ${msg}`)
// Outside a Next.js request there is no page cache to refresh.
const NO_REVALIDATE = { skipRevalidate: true }

// On container start, seed only an empty database: never overwrite what editors changed in the admin.
if (process.argv.includes('--if-empty') || process.env.SEED_IF_EMPTY === 'true') {
  const { totalDocs } = await payload.count({ collection: 'training-domains', overrideAccess: true })
  if (totalDocs > 0) {
    log(`database already has content (${totalDocs} domains): nothing to do`)
    process.exit(0)
  }
}

async function upsert<T extends Record<string, unknown>>(collection: string, where: Record<string, unknown>, data: T): Promise<{ id: number | string }> {
  const found = await payload.find({ collection: collection as never, where: where as never, limit: 1, depth: 0, overrideAccess: true })
  const existing = found.docs[0] as { id: number | string } | undefined
  if (existing) {
    return payload.update({ collection: collection as never, id: existing.id, data: data as never, overrideAccess: true, context: NO_REVALIDATE }) as Promise<{ id: number | string }>
  }
  return payload.create({ collection: collection as never, data: data as never, overrideAccess: true, context: NO_REVALIDATE }) as Promise<{ id: number | string }>
}

// --- Admin account (local / preprod only; credentials come from the environment) ---
if (process.env.SEED_ADMIN_EMAIL && process.env.SEED_ADMIN_PASSWORD) {
  const exists = await payload.find({ collection: 'users', where: { email: { equals: process.env.SEED_ADMIN_EMAIL } }, limit: 1, overrideAccess: true })
  if (!exists.docs.length) {
    await payload.create({ collection: 'users', overrideAccess: true, data: { email: process.env.SEED_ADMIN_EMAIL, password: process.env.SEED_ADMIN_PASSWORD, name: 'Administrateur', roles: ['admin'] } })
    log('admin account created')
  }
}

// --- Site settings ---
await payload.updateGlobal({
  slug: 'site-settings',
  overrideAccess: true,
  context: NO_REVALIDATE,
  data: {
    phone: '+225 07 09 90 16 47',
    whatsapp: '2250103123266',
    whatsappDisplay: '+225 01 03 12 32 66',
    email: 'infos@fatihoune.com',
    address: 'Abidjan, Yopougon, cité Novalim\nBP 92 Dabou',
    hours: '7 h – 12 h · 13 h – 16 h',
    accreditations: [
      { name: 'Habilité FDFP', fullName: 'Habilité par le FDFP', detail: 'Fonds de Développement de la Formation Professionnelle', validUntil: '2026-12-31' },
      { name: 'Membre Réseau GERME', fullName: 'Membre du Réseau GERME Côte d’Ivoire', detail: 'Structure partenaire, méthodologie « Gérez mieux votre entreprise » du Bureau international du Travail' },
    ],
    keyFigures: [
      { value: '500', label: 'jeunes formés et incubés au marketing digital (2020)', source: 'Presentation_fatihoune.docx — publication validée le 2026-10-03' },
      { value: '300', label: 'femmes formées, coopérative BANOUDO (2022)', source: 'Presentation_fatihoune.docx — publication validée le 2026-10-03' },
      { value: '200', label: 'porteurs de projet formés en entrepreneuriat (2023)', source: 'Presentation_fatihoune.docx — publication validée le 2026-10-03' },
    ],
  },
})
log('site settings')

// --- Photos (Unsplash licence, free commercial use; decision K. D. Ismaël 2026-10-03) ---
const imageIds: Record<string, number | string> = {}
for (const [key, img] of Object.entries(images as Record<string, { id: string; author: string; user: string; alt: string }>)) {
  const filename = `${key.replace('/', '-')}.jpg`
  const existing = await payload.find({ collection: 'media', where: { filename: { equals: filename } }, limit: 1, overrideAccess: true })
  const doc = existing.docs[0] ?? await payload.create({
    collection: 'media',
    overrideAccess: true,
    filePath: path.join(imagesDir, filename),
    data: {
      alt: img.alt,
      consent: false,
      credit: { author: img.author, source: 'unsplash', url: `https://unsplash.com/photos/${img.id}` },
    },
  })
  imageIds[key] = doc.id
}
log(`${Object.keys(imageIds).length} photos`)

// --- Certificates ---
const certificates = [
  ['CS1-GRH', 'Certificat de spécialisation en gestion des ressources humaines', 'Gestion des ressources humaines', 120],
  ['CS2-ET', 'Certificat de spécialisation en entrepreneuriat', 'Entrepreneuriat', 100],
  ['CS4-SE', 'Certificat de spécialisation en suivi et évaluation', 'Suivi et évaluation', 100],
  ['CS5-MP', 'Certificat de spécialisation en management de projet', 'Management de projet', 100],
  ['CS8-IF', 'Certificat de spécialisation en ingénierie de formation', 'Ingénierie de formation', 120],
] as const
const certIds: Record<string, number | string> = {}
for (const [i, [code, title, shortTitle, durationHours]] of certificates.entries()) {
  const doc = await upsert('certificates', { code: { equals: code } }, { code, title, shortTitle, durationHours, status: 'published', order: i + 1 })
  certIds[code] = doc.id
}
log(`${certificates.length} certificates`)

// --- Domains and trainings ---
const hours = (d: string | null) => {
  const m = d?.match(/^(\d+)\s*h$/i)
  return m ? Number(m[1]) : undefined
}
let trainingCount = 0
for (const d of domains) {
  const domain = await upsert('training-domains', { slug: { equals: d.slug } }, {
    title: d.title,
    slug: d.slug,
    h1: d.h1,
    summary: d.summary,
    intro: d.intro,
    groups: d.groups.map((g) => ({ title: g.title })),
    relatedCertificate: d.cert ? certIds[d.cert] : undefined,
    extra: d.extra ? rich(...d.extra) : undefined,
    image: imageIds[d.slug],
    status: 'published',
    order: d.order,
    seo: { title: d.seoTitle, description: d.seoDescription },
  })
  let order = 0
  for (const g of d.groups) {
    for (const t of g.items) {
      order++
      await upsert('trainings', { and: [{ title: { equals: t.title } }, { domain: { equals: domain.id } }] }, {
        title: t.title,
        domain: domain.id,
        group: g.title,
        durationLabel: t.duration ?? undefined,
        durationHours: hours(t.duration),
        status: 'published',
        order,
      })
      trainingCount++
    }
  }
}
log(`${domains.length} domains, ${trainingCount} trainings`)

// --- References (all citable: decision K. D. Ismaël, 2026-10-03) ---
const refs: [string, string, string, boolean?][] = [
  ['ministry', 'Ministère de la Promotion de la Jeunesse et de l’Insertion professionnelle', 'Abidjan', true],
  ['ministry', 'Ministère de l’Économie numérique et de la Poste', 'Abidjan'],
  ['ministry', 'Ministère de la Famille, de la Femme et de l’Enfant (MFFE)', 'Abidjan', true],
  ['ministry', 'Direction générale de la Diaspora / DAOSAR', 'Abidjan', true],
  ['ministry', 'Bureau de Coordination des Programmes Emploi (BCPE)', 'Abidjan'],
  ['agency', 'Agence Emploi Jeunes (AEJ)', 'Abidjan', true],
  ['agency', 'Fonds de Développement de la Formation Professionnelle (FDFP)', 'Abidjan'],
  ['agency', 'Côte d’Ivoire PME (CI-PME) / FASI', 'Abidjan'],
  ['agency', 'Bureau ivoirien du droit d’auteur (BURIDA)', 'Abidjan'],
  ['agency', 'Marché des Arts du Spectacle d’Abidjan (MASA)', 'Abidjan'],
  ['agency', 'Abidjan Legacy Program (ALP)', 'Abidjan'],
  ['local', 'Conseil régional des Grands-Ponts', 'Dabou'],
  ['local', 'Conseil régional du Sud-Comoé', 'Adiaké'],
  ['local', 'Conseil régional du Guémon', ''],
  ['local', 'Mairie d’Anyama', 'Anyama'],
  ['local', 'Mairie de Danané', 'Danané'],
  ['local', 'Mairie de Grand-Bassam', 'Grand-Bassam'],
  ['local', 'Union des Villes et Communes de Côte d’Ivoire (UVICOCI)', 'Abidjan'],
  ['international', 'Expertise France', 'Abidjan'],
  ['international', 'Réseau africain de la formation professionnelle (RAFPRO)', 'Abidjan'],
  ['international', 'Réseau ivoirien des gestionnaires des ressources humaines (RIGRH)', 'Abidjan'],
  ['association', 'Coopérative SCOOP-CA BANOUDO', 'San-Pédro'],
  ['association', 'Fédération des associations féminines de San-Pédro', 'San-Pédro'],
  ['association', 'Institut de formation et d’éducation féminine', ''],
]
for (const [i, [category, name, city, isProgramPartner]] of refs.entries()) {
  await upsert('references', { name: { equals: name } }, { category, name, city: city || undefined, canBeCited: true, isProgramPartner: Boolean(isProgramPartner), order: i + 1 })
}
log(`${refs.length} references`)

// --- Pages ---
const credits = Object.values(images as Record<string, { author: string }>)
  .map((i) => i.author)
  .filter((a, i, all) => all.indexOf(a) === i)
  .join(', ')
for (const p of pages) {
  const photo = imageIds[p.path === 'accueil' ? 'home' : p.path === 'a-propos' ? 'about' : p.path]
  const layout = p.layout.map((block, i) => {
    if (i === 0 && block.blockType === 'hero' && photo) return { ...block, image: photo }
    return block
  })
  if (p.path === 'mentions-legales') {
    layout.push({ blockType: 'text', title: 'Crédits photos', body: rich(`Photos d’illustration issues d’Unsplash (licence Unsplash), par : ${credits}. Elles illustrent nos domaines d’activité et ne représentent pas des sessions de formation FATIHOUNE.`) } as never)
  }
  await upsert('pages', { path: { equals: p.path } }, { ...p, layout, status: 'published' })
}
log(`${pages.length} pages`)

// --- Menus « Solutions » / « Vous êtes », search, Digitalisation highlight (fresh installs: published) ---
for (const line of await applyNavigation(payload, { publish: true })) log(line)
for (const line of await applyHomeCards(payload)) log(line)

log('done')
process.exit(0)
