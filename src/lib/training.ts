/** Labels shown next to a training title on its domain page. Shared by the CMS field and the site. */
export const TRAINING_BADGES = ['new', 'popular', 'certifying'] as const
export type TrainingBadge = (typeof TRAINING_BADGES)[number]
export const TRAINING_BADGE_LABELS: Record<TrainingBadge, string> = {
  new: 'Nouveau',
  popular: 'Très demandée',
  certifying: 'Certifiante',
}
