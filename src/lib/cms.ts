import { getPayload } from 'payload'
import config from '@payload-config'

export const cms = async () => getPayload({ config })
