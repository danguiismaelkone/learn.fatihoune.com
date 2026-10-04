/** Run: pnpm seed:home-order — see applyHomeOrder(). */
import { getPayload } from 'payload'
import config from '@payload-config'
import { applyHomeOrder } from './home-order'

const payload = await getPayload({ config })
const report = await applyHomeOrder(payload)
payload.logger.info(`[home-order] ${report.length ? report.join(' ; ') : 'rien à faire, la page d’accueil est déjà dans le bon ordre'}`)
process.exit(0)
