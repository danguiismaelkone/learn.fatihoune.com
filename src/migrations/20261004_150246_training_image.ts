import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`trainings\` ADD \`image_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`trainings_image_idx\` ON \`trainings\` (\`image_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_trainings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`domain_id\` integer NOT NULL,
  	\`group\` text,
  	\`duration_hours\` numeric,
  	\`duration_label\` text,
  	\`slug\` text,
  	\`detail_published\` integer DEFAULT false,
  	\`audience\` text,
  	\`prerequisites\` text,
  	\`objectives\` text,
  	\`program\` text,
  	\`draft_note\` text,
  	\`status\` text DEFAULT 'draft' NOT NULL,
  	\`order\` numeric DEFAULT 100,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`domain_id\`) REFERENCES \`training_domains\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_trainings\`("id", "title", "domain_id", "group", "duration_hours", "duration_label", "slug", "detail_published", "audience", "prerequisites", "objectives", "program", "draft_note", "status", "order", "updated_at", "created_at") SELECT "id", "title", "domain_id", "group", "duration_hours", "duration_label", "slug", "detail_published", "audience", "prerequisites", "objectives", "program", "draft_note", "status", "order", "updated_at", "created_at" FROM \`trainings\`;`)
  await db.run(sql`DROP TABLE \`trainings\`;`)
  await db.run(sql`ALTER TABLE \`__new_trainings\` RENAME TO \`trainings\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`trainings_domain_idx\` ON \`trainings\` (\`domain_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`trainings_slug_idx\` ON \`trainings\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`trainings_status_idx\` ON \`trainings\` (\`status\`);`)
  await db.run(sql`CREATE INDEX \`trainings_updated_at_idx\` ON \`trainings\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`trainings_created_at_idx\` ON \`trainings\` (\`created_at\`);`)
}
