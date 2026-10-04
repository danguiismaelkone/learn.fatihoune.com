/** Minimal Lexical document builder for seeding rich text (paragraphs and bullet lists). */
type Node = Record<string, unknown>

const text = (t: string, bold = false): Node => ({ type: 'text', text: t, format: bold ? 1 : 0, detail: 0, mode: 'normal', style: '', version: 1 })

const inline = (s: string): Node[] =>
  s.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part) => (part.startsWith('**') ? text(part.slice(2, -2), true) : text(part)))

const paragraph = (s: string): Node => ({ type: 'paragraph', children: inline(s), direction: 'ltr', format: '', indent: 0, textFormat: 0, version: 1 })

const list = (items: string[]): Node => ({
  type: 'list',
  listType: 'bullet',
  tag: 'ul',
  start: 1,
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
  children: items.map((it, i) => ({ type: 'listitem', value: i + 1, children: inline(it), direction: 'ltr', format: '', indent: 0, version: 1 })),
})

/** Lines starting with "- " become a bullet list; other lines become paragraphs. */
export function rich(...blocks: (string | string[])[]) {
  const children = blocks.map((b) => (Array.isArray(b) ? list(b) : paragraph(b)))
  return { root: { type: 'root', children, direction: 'ltr', format: '', indent: 0, version: 1 } } as never
}
