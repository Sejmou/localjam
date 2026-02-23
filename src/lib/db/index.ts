import { drizzle } from 'drizzle-orm/pglite';
import { PGlite } from '@electric-sql/pglite';
import * as schema from './schema';

// in-memory database; TODO: figure out why IndexedDB persistence (e.g. 'idb://localjam-db') doesn't work
const client = new PGlite();
await client.waitReady;
export const db = drizzle(client, { schema });
