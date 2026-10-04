import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`leads\` ADD \`tracking_confirmation\` text;`)
  await db.run(sql`ALTER TABLE \`leads\` ADD \`tracking_confirmation_error\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`leads\` DROP COLUMN \`tracking_confirmation\`;`)
  await db.run(sql`ALTER TABLE \`leads\` DROP COLUMN \`tracking_confirmation_error\`;`)
}
