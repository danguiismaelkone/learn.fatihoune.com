/** Labels shown next to a training title on its domain page. Shared by the CMS field and the site. */
export const TRAINING_BADGES = ['new', 'popular', 'certifying'] as const
export type TrainingBadge = (typeof TRAINING_BADGES)[number]
export const TRAINING_BADGE_LABELS: Record<TrainingBadge, string> = {
  new: 'Nouveau',
  popular: 'Très demandée',
  certifying: 'Certifiante',
}

export const slugify = (source: string) =>
  source
    .replace(/œ/g, 'oe')
    .replace(/Œ/g, 'OE')
    .replace(/æ/g, 'ae')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '')
