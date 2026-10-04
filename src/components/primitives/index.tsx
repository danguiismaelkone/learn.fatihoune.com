import type { ReactNode } from 'react'

type SectionProps = {
  children: ReactNode
  tone?: 'paper' | 'white' | 'warm' | 'ink'
  ruled?: boolean
  tight?: boolean
  id?: string
  labelledBy?: string
}

export function Section({ children, tone = 'paper', ruled, tight, id, labelledBy }: SectionProps) {
  const cls = ['section', tone !== 'paper' && `section--${tone}`, ruled && 'section--ruled', tight && 'section--tight']
    .filter(Boolean)
    .join(' ')
  return (
    <section className={cls} id={id} aria-labelledby={labelledBy}>
      <div className="container">{children}</div>
    </section>
  )
}

type HeadingProps = {
  as?: 'h1' | 'h2' | 'h3'
  /** Visual size, decoupled from the semantic level. */
  size?: 1 | 2 | 3
  children: ReactNode
  id?: string
  className?: string
}

export function Heading({ as = 'h2', size, children, id, className }: HeadingProps) {
  const Tag = as
  const visual = size ?? Number(as.slice(1))
  return (
    <Tag id={id} className={['heading', `heading--${visual}`, className].filter(Boolean).join(' ')}>
      {children}
    </Tag>
  )
}

type MediaProps =
  | { src: string; alt: string; width: number; height: number; caption?: string; placeholder?: never; srcSet?: string; sizes?: string; priority?: boolean }
  | { placeholder: string; src?: never; alt?: never; width?: never; height?: never; caption?: never }

/** Image with mandatory alt text; without a photo it renders the Ivorian motif with a caption. */
export function Media(props: MediaProps) {
  if ('placeholder' in props && props.placeholder) {
    return (
      <figure className="media" aria-hidden="true">
        <div className="media__placeholder motif" />
      </figure>
    )
  }
  const { src, alt, width, height, caption, srcSet, sizes, priority } = props as Extract<MediaProps, { src: string }>
  return (
    <figure className="media">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} width={width} height={height} srcSet={srcSet} sizes={sizes} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : undefined} decoding="async" />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <span className="eyebrow">{children}</span>
}

type MediaDocLike = {
  url?: string | null
  alt: string
  width?: number | null
  height?: number | null
  sizes?: Record<string, { url?: string | null; width?: number | null } | undefined> | null
}

/** Builds Media props from a Payload upload document (uses the generated "card" and "wide" sizes). */
export function mediaFromDoc(doc: MediaDocLike | null | undefined, sizes = '(min-width: 1024px) 33vw, 100vw') {
  if (!doc?.url) return null
  const candidates = [doc.sizes?.card, doc.sizes?.wide, { url: doc.url, width: doc.width }]
    .filter((s): s is { url: string; width: number } => Boolean(s?.url && s?.width))
  return {
    src: doc.sizes?.wide?.url || doc.url,
    alt: doc.alt,
    width: doc.width ?? 1600,
    height: doc.height ?? 1200,
    srcSet: candidates.map((s) => `${s.url} ${s.width}w`).join(', ') || undefined,
    sizes,
  }
}
