# LocalJam

This is the code repository for LocalJam, my attempt at realizing my vision of a local-first multi-track audio player that you can use to hone your craft as a musician using any multi-track audio files you own (e.g. ones created from MP3s with AI or actual exports of stems from your DAW).

## Feature Roadmap

These are the features I would like to implement - some are far more complicated than others 😅

- [ ] Import songs (zip-files with audio files for each track)
- [ ] Play and practice songs
  - [ ] Play and pause
  - [ ] Seek
  - [ ] Progress bar
  - [ ] Track Selection (Mute/Solo)
  - [ ] Track Volume Control
  - [ ] Tempo Control
  - [ ] Loop
  - [ ] Playlists
- [ ] Cross-device sync (without central server)
- [ ] Mobile App (MUST work offline; PWA? Native App Wrapper, e.g. Capacitor?)
  - [ ] Basic functionality
  - [ ] Playback controls from lock screen and/or notification bar
  - [ ] 'Pill' (Notch Widget; iOS + Android, if something like that exists there)
- [ ] Additional local processing?
- [ ] Desktop App (Tauri?)

## Tech Stack, Design Philosophy

I want to embrace local-first technology that keeps all the relevant data on the user's device and doesn't require a central server. I strongly believe that people should be able to truly own their media and not have to offload it to third parties.

The project is a web app built with SvelteKit (Svelte 5) and Tailwind CSS. All files will be stored in the browser's buit-in storage (probably IndexedDB). Even the SQL database runs directly inside the browser thanks to Pglite (stored in IndexedDB).

For file/metadata syncing, I want to use Peer-to-Peer technology (let's see if that will work out; at least for the database part I can probably use [Electric](https://github.com/electric-sql/electric)).

## Development

You'll need NodeJS (v20.20+) and pnpm.

For installing dependencies and running the development server, just run:

```bash
pnpm install
pnpm dev
```

### Database migrations

The DB schema is defined through Drizzle (c.f. `$lib/db/schema.ts`) and migrations are generated with drizzlekit. However, due to the fact that the actual DB runs _inside the user's browser_ (via Pglite) and not on some server we control, actually _running_ the migrations is more complicated.

After every change to `$lib/db/schema.ts`, we have to:

1. Generate the migrations on our development machine
2. Run the migrations on our development machine
3. Make sure all the migrations are synced to the client
4. Apply the migrations to the client's DB

The following commands accomplish each step:

1. `pnpm run db:generate` generates new migrations using the Postgres server running on our development machine in NodeJS (note: data is stored in the `.pglite` directory)
2. `pnpm run db:migrate` applies the pending migrations to our development machine's Pglite DB
3. - 4. Just run `pnpm dev`! `@proj-airi/drizzle-orm-browser-migrator` and `@proj-airi/drizzle-orm-browser-migrator` do the heavy lifting here.

`@proj-airi/unplugin-drizzle-orm-migrations` is a bundler plugin (Vite, esbuild, Webpack, etc.) that automatically discovers our generated Drizzle-Kit migration files (e.g., `drizzle/0000_*.sql`) from `drizzle` and bundles them into a single virtual module.

We use those migrations in `$lib/db/index.ts`:

```typescript
import migrations from 'virtual:drizzle-migrations.sql'
```

> Note: The `virtual:` prefix is important here! If we don't use it, Vite assumes it's a real file we try to import and throws an error.

To make the bundling of the migrations work, we

1. added the plugin to `vite.config.ts`:

   ```typescript
   import DrizzleORMMigrations from '@proj-airi/unplugin-drizzle-orm-migrations/vite';

   ...
   export default defineConfig({
       plugins: [tailwindcss(), sveltekit(), devtoolsJson(), DrizzleORMMigrations()], // <- added DrizzleORMMigrations() here
   });
   ```

2. added its TypeScript type definitions to `tsconfig.json`:
   ```json
   ...
   "types": [
       "@proj-airi/unplugin-drizzle-orm-migrations/types"
   ]
   ...
   ```

`@proj-airi/drizzle-orm-browser-migrator/pglite` takes care of actually _applying_ the migrations to the client's DB.

We use it in `$lib/db/index.ts`:

```typescript
import { migrate } from '@proj-airi/drizzle-orm-browser-migrator/pglite';
...
await migrate(db, migrations);
```
