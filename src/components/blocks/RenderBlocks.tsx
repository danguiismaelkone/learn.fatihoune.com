import Link from 'next/link'
import type { Media as MediaDoc, Page, SiteSetting, TrainingDomain } from '@/payload-types'
import { Eyebrow, Heading, Media, Section, mediaFromDoc } from '@/components/primitives'
import { CtaButton } from '@/components/ui/CtaButton'
import { ClockIcon } from '@/components/ui/icons'
import { SearchForm } from '@/components/ui/SearchForm'
import { CallbackForm } from '@/components/ui/Callback'
import { contactHref, whatsappHref, type CtaKind } from '@/components/ui/cta'
import { RichText } from '@/components/ui/RichText'
import { getCitableReferences } from '@/content/queries/references'
import { getDomains, getPopularTrainings, getTrainingCounts } from '@/content/queries/trainings'

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

async function DomainIndex({ title, ctx }: { title: string; ctx: Ctx }) {
  const [domains, counts, popular] = await Promise.all([getDomains(), getTrainingCounts(), getPopularTrainings()])
  const total = [...counts.values()].reduce((a, b) => a + b, 0)
  return (
    <>
      <Section tone="white">
        <div className="stack stack--lg">
          <div className="cluster" style={{ justifyContent: 'space-between' }}>
            <Heading>{title}</Heading>
            <Link className="link" href="/formations">Toutes les formations ({total})</Link>
          </div>
          <ol className="domain-chips">
            {domains.map((d, i) => {
              const n = counts.get(d.id) ?? 0
              return (
                <li key={d.id}>
                  <Link href={`/formations/${d.slug}`}>
                    <em className="num">{pad(i + 1)}</em>
                    <span className="domain-chips__title">{d.title}</span>
                    <span className="domain-chips__count">{n}<span className="sr-only"> formation{n > 1 ? 's' : ''}</span></span>
                  </Link>
                </li>
              )
            })}
          </ol>
        </div>
        <div className="motif domain-chips__band" aria-hidden="true" />
      </Section>
      {popular.length ? (
        <Section tone="warm" labelledBy="popular-title">
          <div className="stack stack--lg">
            <Heading id="popular-title">Les formations les plus demandées</Heading>
            <ul className="course-cards">
              {popular.map((t) => {
                const domain = t.domain as TrainingDomain
                const page = t.detailPublished && t.slug ? `/formations/${domain.slug}/${t.slug}` : null
                // The training's own photo first, then its domain's.
                const own = typeof t.image === 'object' ? (t.image as MediaDoc | null) : null
                const fallback = typeof domain.image === 'object' ? (domain.image as MediaDoc | null) : null
                const photo = mediaFromDoc(own ?? fallback, '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw')
                return (
                  <li key={t.id} className="course-card">
                    {photo ? <Media {...photo} alt="" /> : <Media placeholder="photo à venir" />}
                    <div className="course-card__body">
                      <Link className="course-card__domain" href={`/formations/${domain.slug}`}>{domain.title}</Link>
                      <h3 className="course-card__title">
                        {page ? <Link href={page}>{t.title}</Link> : t.title}
                      </h3>
                      {page && t.audience ? <p className="course-card__lead">Pour : {t.audience}</p> : null}
                      {t.durationLabel ? (
                        <p className="course-card__meta"><ClockIcon className="course-card__icon" /> {t.durationLabel}</p>
                      ) : null}
                      <div className="course-card__foot">
                        {page ? (
                          <Link className="btn btn--primary btn--compact" href={page}>Voir la formation<span className="sr-only"> : {t.title}</span></Link>
                        ) : (
                          <Link className="btn btn--primary btn--compact" href={contactHref('quote', `${domain.title} › ${t.title}`, ctx.from)}>Demander un devis<span className="sr-only"> : {t.title}</span></Link>
                        )}
                        <span className="course-card__price">Sur devis · FDFP</span>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </Section>
      ) : null}
    </>
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
  // Cegos-style trust block: centred wall (logo when uploaded, otherwise the name), button, then the key-figure tiles.
  return (
    <Section tone="white" ruled>
      <div className="stack stack--lg trust">
        <div className="stack stack--sm">
          <Heading>{block.title}</Heading>
          {block.intro ? <p className="text text--soft">{block.intro}</p> : null}
        </div>
        {refs.length >= 4 ? (
          <ul className="trust-wall">
            {refs.slice(0, 12).map((r) => {
              const logo = typeof r.logo === 'object' ? (r.logo as MediaDoc | null) : null
              return (
                <li key={r.id}>
                  {logo?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logo.sizes?.card?.url || logo.url} alt={r.name} loading="lazy" decoding="async" />
                  ) : (
                    <span>{r.name}</span>
                  )}
                </li>
              )
            })}
          </ul>
        ) : null}
        <div className="trust__cta">
          <Link className="btn btn--primary" href="/references">Voir nos {refs.length} références</Link>
        </div>
        {block.showStats ? <Stats settings={ctx.settings} /> : null}
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
        out.push(<DomainIndex key={key} title={block.title} ctx={ctx} />)
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
        if (block.style === 'pillars') {
          out.push(
            <Section key={key} tone="white">
              <div className="stack stack--lg">
                <Heading>{block.title}</Heading>
                {block.intro ? <p className="text text--soft">{block.intro}</p> : null}
                <ol className="pillars">
                  {block.items?.map((it, n) => (
                    <li key={it.id}>
                      <span className="pillars__num" aria-hidden="true">{String(n + 1).padStart(2, '0')}</span>
                      {it.strong ? <h3 className="heading heading--3">{it.strong.replace(/[.:]\s*$/, '')}</h3> : null}
                      <p className="text text--soft">{it.text}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </Section>,
          )
          break
        }
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
              {block.style === 'photo' ? (
                <ul className="photo-cards">
                  {block.items?.map((c) => {
                    const img = typeof c.image === 'object' ? (c.image as MediaDoc | null) : null
                    const photo = mediaFromDoc(img, '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw')
                    return (
                      <li key={c.id}>
                        <Link className="photo-card" href={c.href}>
                          {photo ? <Media {...photo} alt="" /> : <Media placeholder="Photo à venir" />}
                          <span className="photo-card__body">
                            {c.eyebrow ? <Eyebrow>{c.eyebrow}</Eyebrow> : null}
                            <Heading as="h3" size={3}>{c.title}</Heading>
                            {c.text ? <span className="text text--soft">{c.text}</span> : null}
                            <span className="photo-card__link">{c.linkLabel || 'En savoir plus'} <span aria-hidden="true">›</span></span>
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              ) : block.style === 'doors' ? (
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
        if (block.style === 'band') {
          out.push(
            <Section key={key} tight>
              <div className="cta-band">
                <div className="stack stack--sm">
                  <strong className="heading heading--3">{block.title}</strong>
                  {block.text ? <p className="text">{block.text}</p> : null}
                </div>
                <Buttons buttons={block.buttons as Cta[]} ctx={ctx} />
              </div>
            </Section>,
          )
          break
        }
        // Last block of the page: one closing contact block (buttons + callback form), replacing the
        // global « Vous souhaitez être rappelé ? » section, which CSS hides when [data-closing] is present.
        if (i === blocks.length - 1) {
          out.push(
            <section key={key} className="section section--warm section--ruled closing" data-closing aria-labelledby={`h-${key}`}>
              <div className="container closing__inner">
                <div className="stack">
                  <Heading id={`h-${key}`}>{block.title}</Heading>
                  {block.text ? <p className="text">{block.text}</p> : null}
                  <Buttons buttons={block.buttons as Cta[]} ctx={ctx} />
                </div>
                <div className="closing__callback stack stack--sm">
                  <strong className="heading heading--3">Ou laissez votre numéro, nous vous rappelons</strong>
                  <CallbackForm whatsappUrl={whatsappHref(ctx.settings.whatsapp)} idPrefix={`cl-${key}`} layout="compact" />
                </div>
              </div>
            </section>,
          )
          break
        }
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
