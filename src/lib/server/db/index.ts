import { drizzle } from 'drizzle-orm/pglite';
import { PGlite } from '@electric-sql/pglite';
import * as schema from './schema';

// PG Lite database, persisted to IndexedDB
const client = new PGlite('idb://my-pgdata');
export const db = drizzle(client, { schema });
