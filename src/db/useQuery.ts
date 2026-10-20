import { addDatabaseChangeListener } from 'expo-sqlite';
import { useEffect, useState } from 'react';

/**
 * Runs a synchronous query on render and re-renders whenever one of `tables` changes.
 * (Drizzle's useLiveQuery only watches the query's main table and starts empty.)
 */
export function useQuery<T>(run: () => T, tables: string[]): T {
  const [, setVersion] = useState(0);
  const watched = tables.join(',');

  useEffect(() => {
    const names = watched.split(',');
    const subscription = addDatabaseChangeListener(({ tableName }) => {
      if (names.includes(tableName)) setVersion((v) => v + 1);
    });
    return () => subscription.remove();
  }, [watched]);

  return run();
}
