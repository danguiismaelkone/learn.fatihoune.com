/** Run: pnpm seed:home-cards — see applyHomeCards(). */
import { getPayload } from 'payload'
import config from '@payload-config'
import { applyHomeCards } from './home-cards'

const payload = await getPayload({ config })
const report = await applyHomeCards(payload)
payload.logger.info(`[home-cards] ${report.length ? report.join(' ; ') : 'rien à faire, la page d’accueil est déjà à jour'}`)
process.exit(0)
