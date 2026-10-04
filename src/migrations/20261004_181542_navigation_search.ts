import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`site_settings_popular_searches\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`term\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_popular_searches_order_idx\` ON \`site_settings_popular_searches\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_popular_searches_parent_id_idx\` ON \`site_settings_popular_searches\` (\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`featured_solution_eyebrow\` text;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`featured_solution_title\` text;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`featured_solution_text\` text;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`featured_solution_href\` text;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`featured_solution_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`site_settings_featured_solution_featured_solution_image_idx\` ON \`site_settings\` (\`featured_solution_image_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`site_settings_popular_searches\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_site_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`phone\` text NOT NULL,
  	\`whatsapp\` text NOT NULL,
  	\`whatsapp_display\` text NOT NULL,
  	\`email\` text NOT NULL,
  	\`address\` text NOT NULL,
  	\`hours\` text,
  	\`response_delay\` text,
  	\`catalog_pdf_id\` integer,
  	\`presentation_pdf_id\` integer,
  	\`notify_emails\` text,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`catalog_pdf_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`presentation_pdf_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_site_settings\`("id", "phone", "whatsapp", "whatsapp_display", "email", "address", "hours", "response_delay", "catalog_pdf_id", "presentation_pdf_id", "notify_emails", "updated_at", "created_at") SELECT "id", "phone", "whatsapp", "whatsapp_display", "email", "address", "hours", "response_delay", "catalog_pdf_id", "presentation_pdf_id", "notify_emails", "updated_at", "created_at" FROM \`site_settings\`;`)
  await db.run(sql`DROP TABLE \`site_settings\`;`)
  await db.run(sql`ALTER TABLE \`__new_site_settings\` RENAME TO \`site_settings\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`site_settings_catalog_pdf_idx\` ON \`site_settings\` (\`catalog_pdf_id\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_presentation_pdf_idx\` ON \`site_settings\` (\`presentation_pdf_id\`);`)
}
