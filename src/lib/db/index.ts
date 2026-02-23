import { drizzle } from 'drizzle-orm/pglite';
import { PGlite } from '@electric-sql/pglite';
import * as schema from './schema';

const client = new PGlite('idb://localjam-db');
await client.waitReady;
export const db = drizzle(client, { schema });
