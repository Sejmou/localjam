import { drizzle } from 'drizzle-orm/pglite';
import { PGlite } from '@electric-sql/pglite';
import * as schema from './schema';
import { migrate } from '@proj-airi/drizzle-orm-browser-migrator/pglite';
import migrations from 'virtual:drizzle-migrations.sql';

const client = new PGlite('idb://localjam-db');
await client.waitReady;
const _db = drizzle(client, { schema });
await migrate(_db, migrations);
export const db = _db;
