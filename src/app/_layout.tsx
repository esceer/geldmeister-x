import '@/i18n';

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import { GlassBackground } from '@/components/ui/GlassBackground';
import { Snackbar } from '@/components/ui/Snackbar';
import { Text } from '@/components/ui/Text';
import { useDatabase } from '@/db/useDatabase';
import { colors } from '@/theme';

SplashScreen.preventAutoHideAsync();

// Sheets are transparent modals; the sheet itself animates in.
const sheetOptions = { presentation: 'transparentModal', animation: 'fade' } as const;

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const db = useDatabase();
  const { t } = useTranslation();
  const ready = fontsLoaded && (db.ready || db.error);

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  if (db.error) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center', padding: 20 }}>
        <Text>{t('common.dbError', { message: db.error.message })}</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
      <KeyboardProvider>
        <GlassBackground />
        <StatusBar style="light" />
        <Stack
          screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }}
        >
          <Stack.Screen name="(tabs)" />
          {['expense', 'category', 'tag'].map((name) => (
            <Stack.Screen key={name} name={name} options={sheetOptions} />
          ))}
        </Stack>
        <Snackbar />
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
