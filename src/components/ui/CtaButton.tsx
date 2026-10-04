import Link from 'next/link'
import { ChatIcon } from './icons'
import { ctaHref, type CtaKind } from './cta'

type Props = {
  cta: { label: string; kind: CtaKind; href?: string | null; topic?: string | null }
  variant?: 'primary' | 'secondary'
  ctx: { whatsapp: string; pageTitle?: string; from?: string }
  block?: boolean
  id?: string
}

export function CtaButton({ cta, variant = 'primary', ctx, block, id }: Props) {
  const href = ctaHref(cta, ctx)
  const cls = ['btn', `btn--${cta.kind === 'whatsapp' ? 'secondary' : variant}`, block && 'btn--block'].filter(Boolean).join(' ')
  if (cta.kind === 'whatsapp') {
    return (
      <a id={id} className={cls} href={href} target="_blank" rel="noopener noreferrer">
        <ChatIcon /> {cta.label}
      </a>
    )
  }
  return (
    <Link id={id} className={cls} href={href}>
      {cta.label}
    </Link>
  )
}
