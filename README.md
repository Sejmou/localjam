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
- [ ] Additional local processing?

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
