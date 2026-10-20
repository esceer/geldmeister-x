import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

import * as schema from './schema';

// The change listener lets useQuery re-run queries when tables change.
const sqlite = openDatabaseSync('geldmeister.db', { enableChangeListener: true });

export const db = drizzle(sqlite, { schema });

/** A transaction handle, for helpers that write as part of a larger transaction. */
export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];
