import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`media\` ADD \`credit_author\` text;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`credit_source\` text;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`credit_url\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`credit_author\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`credit_source\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`credit_url\`;`)
}
