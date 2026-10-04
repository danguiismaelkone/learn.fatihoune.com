import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`leads\` ADD \`training_location\` text;`)
  await db.run(sql`ALTER TABLE \`leads\` ADD \`fdfp_funding\` integer;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`leads\` DROP COLUMN \`training_location\`;`)
  await db.run(sql`ALTER TABLE \`leads\` DROP COLUMN \`fdfp_funding\`;`)
}
