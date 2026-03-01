CREATE TABLE "songs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"artist" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tracks" (
	"content_hash" text PRIMARY KEY NOT NULL,
	"file_extension" text NOT NULL,
	"label" text NOT NULL,
	"song_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_song_id_songs_id_fk" FOREIGN KEY ("song_id") REFERENCES "public"."songs"("id") ON DELETE cascade ON UPDATE no action;