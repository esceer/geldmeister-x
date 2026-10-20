import { useTranslation } from 'react-i18next';

import { Screen } from '@/components/ui/Screen';

export default function SettingsScreen() {
  const { t } = useTranslation();
  return <Screen title={t('settings.title')} />;
}
