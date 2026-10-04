export type CtaKind = 'quote' | 'info' | 'partnership' | 'whatsapp' | 'link'

export const contactHref = (type: 'quote' | 'info' | 'partnership', topic?: string | null, from?: string) => {
  const params = new URLSearchParams({ type })
  if (topic) params.set('topic', topic)
  if (from) params.set('from', from)
  return `/contact?${params.toString()}`
}

export const whatsappHref = (number: string, pageTitle?: string) => {
  const text = pageTitle
    ? `Bonjour FATIHOUNE, je vous contacte depuis la page « ${pageTitle} » de votre site.`
    : 'Bonjour FATIHOUNE, je vous contacte depuis votre site.'
  return `https://wa.me/${number.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`
}

export const ctaHref = (
  cta: { kind: CtaKind; href?: string | null; topic?: string | null },
  ctx: { whatsapp: string; pageTitle?: string; from?: string },
) => {
  if (cta.kind === 'whatsapp') return whatsappHref(ctx.whatsapp, ctx.pageTitle)
  if (cta.kind === 'link') return cta.href || '/'
  return contactHref(cta.kind, cta.topic, ctx.from)
}
