import Link from 'next/link'
import type { Media as MediaDoc, Page, SiteSetting } from '@/payload-types'
import { Eyebrow, Heading, Media, Section, mediaFromDoc } from '@/components/primitives'
import { CtaButton } from '@/components/ui/CtaButton'
import { SearchForm } from '@/components/ui/SearchForm'
import type { CtaKind } from '@/components/ui/cta'
import { RichText } from '@/components/ui/RichText'
import { getCitableReferences } from '@/content/queries/references'
import { getDomains, getTrainingCounts } from '@/content/queries/trainings'

type Block = Page['layout'][number]
type Ctx = { settings: SiteSetting; pageTitle: string; from: string }
const pad = (n: number) => String(n).padStart(2, '0')
const ctaCtx = (ctx: Ctx) => ({ whatsapp: ctx.settings.whatsapp, pageTitle: ctx.pageTitle, from: ctx.from })

type Cta = { label: string; kind: CtaKind; href?: string | null; topic?: string | null; id?: string | null }

function Buttons({ buttons, ctx, firstId }: { buttons?: Cta[] | null; ctx: Ctx; firstId?: string }) {
  if (!buttons?.length) return null
  return (
    <div className="cluster">
      {buttons.map((b, i) => (
        <CtaButton key={b.id ?? i} id={i === 0 ? firstId : undefined} cta={b} variant={i === 0 ? 'primary' : 'secondary'} ctx={ctaCtx(ctx)} />
      ))}
    </div>
  )
}

async function DomainIndex({ title }: { title: string }) {
  const [domains, counts] = await Promise.all([getDomains(), getTrainingCounts()])
  const total = [...counts.values()].reduce((a, b) => a + b, 0)
  return (
    <Section tone="white" ruled>
      <div className="stack stack--lg">
        <div className="cluster" style={{ justifyContent: 'space-between' }}>
          <Heading>{title}</Heading>
          <Link className="link" href="/formations">Toutes les formations ({total})</Link>
        </div>
        <ol className="index">
          {domains.map((d, i) => {
            const n = counts.get(d.id) ?? 0
            return (
              <li key={d.id}>
                <Link href={`/formations/${d.slug}`}>
                  <em className="num">{pad(i + 1)}</em>
                  <span className="index__title">{d.title}<span className="index__summary">{d.summary}</span></span>
                  <span className="index__count">{n} formation{n > 1 ? 's' : ''}</span>
                </Link>
              </li>
            )
          })}
        </ol>
      </div>
    </Section>
  )
}

export function Stats({ settings }: { settings: SiteSetting }) {
  if (!settings.keyFigures?.length) return null
  return (
    <ul className="stats">
      {settings.keyFigures.map((f) => (
        <li key={f.id}><span className="stat__value">{f.value}</span><span className="stat__label">{f.label}</span></li>
      ))}
    </ul>
  )
}

async function ReferencesTeaser({ block, ctx }: { block: Extract<Block, { blockType: 'referencesTeaser' }>; ctx: Ctx }) {
  const refs = await getCitableReferences()
  return (
    <Section tone="white" ruled>
      <div className="stack stack--lg">
        <Heading>{block.title}</Heading>
        {block.intro ? <p className="text text--soft">{block.intro}</p> : null}
        {block.showStats ? <Stats settings={ctx.settings} /> : null}
        {refs.length >= 4 ? <ul className="clients">{refs.slice(0, 8).map((r) => <li key={r.id}>{r.name}</li>)}</ul> : null}
        <Link className="link" href="/references">Voir nos {refs.length} références</Link>
      </div>
    </Section>
  )
}

async function Partners({ title }: { title: string }) {
  const refs = await getCitableReferences({ programPartnersOnly: true })
  if (refs.length < 2) return null
  return (
    <Section>
      <div className="stack">
        <Heading>{title}</Heading>
        <ul className="clients">
          {refs.map((r) => {
            const logo = typeof r.logo === 'object' ? (r.logo as MediaDoc | null) : null
            return (
              <li key={r.id}>
                {logo?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logo.url} alt={`Logo de ${r.name}`} />
                ) : null}
                {r.name}
              </li>
            )
          })}
        </ul>
      </div>
    </Section>
  )
}

export async function RenderBlocks({ blocks, ctx }: { blocks: Block[]; ctx: Ctx }) {
  let heroDone = false
  const out = []
  for (const [i, block] of blocks.entries()) {
    const key = block.id ?? i
    switch (block.blockType) {
      case 'hero': {
        const first = !heroDone
        heroDone = true
        const image = typeof block.image === 'object' ? (block.image as MediaDoc | null) : null
        const proofs = block.showProof ? (ctx.settings.accreditations ?? []).map((a) => a.name) : []
        const hasMedia = Boolean(image?.url) || block.withPhotoSlot
        const photo = mediaFromDoc(image, '100vw')
        if (block.variant === 'fullbleed' && photo) {
          out.push(
            <section key={key} className="hero-full" aria-labelledby={`h-${key}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="hero-full__img" src={photo.src} srcSet={photo.srcSet} sizes="100vw" alt="" fetchPriority={first ? 'high' : undefined} loading={first ? 'eager' : 'lazy'} />
              <div className="container hero-full__inner">
                <div className="stack stack--lg">
                  <div className="stack">
                    {block.eyebrow ? <Eyebrow>{block.eyebrow}</Eyebrow> : null}
                    <Heading as={first ? 'h1' : 'h2'} size={1} id={`h-${key}`}>{block.title}</Heading>
                    <p className="text">{block.lead}</p>
                  </div>
                  {block.showSearch ? <SearchForm variant="hero" id={`q-${key}`} /> : null}
                  <Buttons buttons={block.buttons as Cta[]} ctx={ctx} firstId={first ? 'primary-cta' : undefined} />
                  {proofs.length ? <ul className="proof" aria-label="Nos garanties">{proofs.map((p) => <li key={p}>{p}</li>)}</ul> : null}
                </div>
              </div>
              <div className="motif hero-full__band" aria-hidden="true" />
            </section>,
          )
          break
        }
        out.push(
          <section key={key} className={hasMedia ? 'container hero' : 'container hero'} aria-labelledby={`h-${key}`}>
            <div className="motif hero__motif" aria-hidden="true" />
            <div className="stack">
              {block.eyebrow ? <Eyebrow>{block.eyebrow}</Eyebrow> : null}
              <Heading as={first ? 'h1' : 'h2'} size={1} id={`h-${key}`}>{block.title}</Heading>
              <p className="text text--soft">{block.lead}</p>
              {block.showSearch ? <SearchForm id={`q-${key}`} /> : null}
              <Buttons buttons={block.buttons as Cta[]} ctx={ctx} firstId={first ? 'primary-cta' : undefined} />
              {proofs.length ? <ul className="proof" aria-label="Nos garanties">{proofs.map((p) => <li key={p}>{p}</li>)}</ul> : null}
            </div>
            {hasMedia ? (
              <div className="hero__media">
                {photo ? (
                  <Media {...photo} sizes="(min-width: 1024px) 33vw, 100vw" priority={first} />
                ) : (
                  <Media placeholder="Photo à venir" />
                )}
              </div>
            ) : null}
          </section>,
        )
        break
      }
      case 'domainIndex':
        out.push(<DomainIndex key={key} title={block.title} />)
        break
      case 'referencesTeaser':
        out.push(<ReferencesTeaser key={key} block={block} ctx={ctx} />)
        break
      case 'text':
        out.push(
          <Section key={key} id={block.anchor ?? undefined} tone={block.tone === 'white' ? 'white' : 'paper'} ruled={block.tone === 'white'} tight={block.tone === 'callout'}>
            <div className={block.tone === 'callout' ? 'callout stack stack--sm' : 'stack'}>
              {block.title ? <Heading size={block.tone === 'callout' ? 3 : 2}>{block.title}</Heading> : null}
              <RichText data={block.body} />
            </div>
          </Section>,
        )
        break
      case 'steps':
        out.push(
          <Section key={key} tone="white" ruled>
            <div className="stack stack--lg">
              <Heading>{block.title}</Heading>
              <ol className="steps">
                {block.items?.map((s) => (
                  <li key={s.id}><div className="stack stack--sm"><strong>{s.title}</strong>{s.body ? <p className="text text--soft">{s.body}</p> : null}</div></li>
                ))}
              </ol>
            </div>
          </Section>,
        )
        break
      case 'list':
        out.push(
          <Section key={key}>
            <div className="stack">
              <Heading>{block.title}</Heading>
              {block.intro ? <p className="text">{block.intro}</p> : null}
              <ul className="bullets text">
                {block.items?.map((it) => <li key={it.id}>{it.strong ? <strong>{it.strong} </strong> : null}{it.text}</li>)}
              </ul>
            </div>
          </Section>,
        )
        break
      case 'stats':
        out.push(
          <Section key={key} tight>
            <div className="stack">{block.title ? <Heading size={3}>{block.title}</Heading> : null}<Stats settings={ctx.settings} /></div>
          </Section>,
        )
        break
      case 'timeline':
        out.push(
          <Section key={key} tone="white" ruled>
            <div className="stack">
              <Heading>{block.title}</Heading>
              <ol className="timeline">
                {block.items?.map((it) => <li key={it.id}><span className="timeline__year">{it.year}</span><span>{it.text}</span></li>)}
              </ol>
            </div>
          </Section>,
        )
        break
      case 'linkCards':
        out.push(
          <Section key={key}>
            <div className="stack stack--lg">
              {block.title ? <Heading>{block.title}</Heading> : null}
              {block.style === 'doors' ? (
                <div className="doors">
                  {block.items?.map((c) => (
                    <Link key={c.id} href={c.href}>
                      {c.eyebrow ? <Eyebrow>{c.eyebrow}</Eyebrow> : null}
                      <Heading as="h3" size={3}>{c.title}</Heading>
                      {c.text ? <p className="text text--soft">{c.text}</p> : null}
                    </Link>
                  ))}
                </div>
              ) : (
                <ul className="cards">
                  {block.items?.map((c) => (
                    <li key={c.id}>
                      <Link className="card" href={c.href}>
                        {c.eyebrow ? <Eyebrow>{c.eyebrow}</Eyebrow> : null}
                        <Heading as="h3" size={3}>{c.title}</Heading>
                        {c.text ? <p className="text text--soft">{c.text}</p> : null}
                        <span className="card__meta"><span /> <span aria-hidden="true">›</span></span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Section>,
        )
        break
      case 'partners':
        out.push(<Partners key={key} title={block.title} />)
        break
      case 'demand':
        out.push(
          <Section key={key} tone="warm">
            <div className="stack">
              <Heading>{block.title}</Heading>
              {block.text ? <p className="text">{block.text}</p> : null}
              <Buttons buttons={block.buttons as Cta[]} ctx={ctx} />
            </div>
          </Section>,
        )
        break
    }
  }
  return <>{out}</>
}
