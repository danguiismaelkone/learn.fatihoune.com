import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`trainings\` ADD \`slug\` text;`)
  await db.run(sql`ALTER TABLE \`trainings\` ADD \`detail_published\` integer DEFAULT false;`)
  await db.run(sql`ALTER TABLE \`trainings\` ADD \`prerequisites\` text;`)
  await db.run(sql`ALTER TABLE \`trainings\` ADD \`program\` text;`)
  await db.run(sql`ALTER TABLE \`trainings\` ADD \`draft_note\` text;`)
  await db.run(sql`CREATE UNIQUE INDEX \`trainings_slug_idx\` ON \`trainings\` (\`slug\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX \`trainings_slug_idx\`;`)
  await db.run(sql`ALTER TABLE \`trainings\` DROP COLUMN \`slug\`;`)
  await db.run(sql`ALTER TABLE \`trainings\` DROP COLUMN \`detail_published\`;`)
  await db.run(sql`ALTER TABLE \`trainings\` DROP COLUMN \`prerequisites\`;`)
  await db.run(sql`ALTER TABLE \`trainings\` DROP COLUMN \`program\`;`)
  await db.run(sql`ALTER TABLE \`trainings\` DROP COLUMN \`draft_note\`;`)
}
