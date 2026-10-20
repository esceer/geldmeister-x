import { migrate } from 'drizzle-orm/expo-sqlite/migrator';
import { useEffect, useState } from 'react';

import { db } from './client';
import migrations from './migrations/migrations';
import { seedIfEmpty } from './seed';

type State = { ready: boolean; error?: Error };

// Runs pending migrations, then seeds a fresh install. `ready` gates the UI.
export function useDatabase() {
  const [state, setState] = useState<State>({ ready: false });

  useEffect(() => {
    migrate(db, migrations)
      .then(() => {
        seedIfEmpty();
        setState({ ready: true });
      })
      .catch((error: Error) => setState({ ready: false, error }));
  }, []);

  return state;
}
