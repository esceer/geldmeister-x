import { router } from 'expo-router';
import { Check } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Sheet } from '@/components/ui/Sheet';
import { Text } from '@/components/ui/Text';
import { colors } from '@/theme';

import { useSettings, type LanguageSetting } from '../store';

const options: LanguageSetting[] = ['system', 'en', 'hu'];

export function LanguageSheet() {
  const { t } = useTranslation();
  const language = useSettings((s) => s.language);
  const setLanguage = useSettings((s) => s.setLanguage);

  return (
    <Sheet title={t('settings.language')}>
      <Card>
        {options.map((option, index) => (
          <Pressable
            key={option}
            onPress={() => {
              setLanguage(option);
              router.back();
            }}
            accessibilityState={{ selected: option === language }}
            style={[styles.row, index < options.length - 1 && styles.divider]}
          >
            <Text weight="medium" style={styles.label}>
              {t(`settings.languages.${option}`)}
            </Text>
            {option === language ? (
              <Check size={20} color={colors.accent} strokeWidth={2.2} />
            ) : null}
          </Pressable>
        ))}
      </Card>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', height: 56, paddingHorizontal: 16 },
  divider: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)' },
  label: { flex: 1 },
});
