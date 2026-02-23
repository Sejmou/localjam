import { pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const songs = pgTable('songs', {
	id: uuid('id').primaryKey().defaultRandom(),
	title: text('title').notNull(),
	artist: text('artist').notNull()
});

export const tracks = pgTable('tracks', {
	songId: uuid('song_id')
		.notNull()
		.references(() => songs.id),
	label: text('label').notNull(),
	fileId: uuid('file_id').notNull()
});
