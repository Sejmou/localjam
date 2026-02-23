CREATE TABLE "songs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"artist" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tracks" (
	"song_id" uuid NOT NULL,
	"label" text NOT NULL,
	"file_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_song_id_songs_id_fk" FOREIGN KEY ("song_id") REFERENCES "public"."songs"("id") ON DELETE no action ON UPDATE no action;