import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

import * as schema from './schema';

// Change listener enables live queries (useLiveQuery) in feature hooks.
const sqlite = openDatabaseSync('geldmeister.db', { enableChangeListener: true });

export const db = drizzle(sqlite, { schema });
