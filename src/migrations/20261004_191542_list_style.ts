import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`pages_blocks_list\` ADD \`style\` text DEFAULT 'bullets';`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_list\` ADD \`style\` text DEFAULT 'bullets';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`pages_blocks_list\` DROP COLUMN \`style\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_list\` DROP COLUMN \`style\`;`)
}
