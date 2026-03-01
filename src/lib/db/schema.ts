import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import type { InferSelectModel } from 'drizzle-orm';

export const songs = pgTable('songs', {
	id: uuid('id').primaryKey().defaultRandom(),
	title: text('title').notNull(),
	artist: text('artist').notNull()
});

export const tracks = pgTable('tracks', {
	contentHash: text('content_hash').primaryKey(),
	fileExtension: text('file_extension').notNull(),
	label: text('label').notNull(),
	songId: uuid('song_id')
		.notNull()
		.references(() => songs.id, { onDelete: 'cascade' })
});

export type Song = InferSelectModel<typeof songs>;
export type Track = InferSelectModel<typeof tracks>;
