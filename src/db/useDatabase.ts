import { migrate } from 'drizzle-orm/expo-sqlite/migrator';
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { generateDueExpenses } from '@/features/recurring/queries';

import { db } from './client';
import migrations from './migrations/migrations';
import { seedIfEmpty } from './seed';

type State = { ready: boolean; error?: Error };

// Runs pending migrations, seeds a fresh install and adds due recurring expenses (also whenever
// the app returns to the foreground). `ready` gates the UI.
export function useDatabase() {
  const [state, setState] = useState<State>({ ready: false });

  useEffect(() => {
    migrate(db, migrations)
      .then(() => {
        seedIfEmpty();
        generateDueExpenses();
        setState({ ready: true });
      })
      .catch((error: Error) => setState({ ready: false, error }));
  }, []);

  useEffect(() => {
    if (!state.ready) return;
    const subscription = AppState.addEventListener('change', (status) => {
      if (status === 'active') generateDueExpenses();
    });
    return () => subscription.remove();
  }, [state.ready]);

  return state;
}
