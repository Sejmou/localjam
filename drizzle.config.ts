import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/lib/db/schema.ts',
	dialect: 'postgresql',
	driver: 'pglite',
	dbCredentials: {
		// Directory for PGlite data when running drizzle-kit in Node (push, migrate, studio).
		// Your app can still use idb:// for browser IndexedDB at runtime.
		url: './.pglite'
	},
	out: './drizzle',
	verbose: true,
	strict: true
});
