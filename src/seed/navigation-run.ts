/** Run: pnpm seed:navigation (new pages as drafts) or PUBLISH=1 pnpm seed:navigation — see applyNavigation(). */
import { getPayload } from 'payload'
import config from '@payload-config'
import { applyNavigation } from './navigation'

const payload = await getPayload({ config })
// `payload run` does not forward CLI flags to the script: the flag is read from the environment.
const publish = process.env.PUBLISH === '1' || process.argv.includes('--publish')
const report = await applyNavigation(payload, { publish })
payload.logger.info(`[navigation] ${report.length ? report.join(' ; ') : 'rien à faire, tout est déjà en place'}`)
process.exit(0)
