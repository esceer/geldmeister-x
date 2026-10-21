import { Stack } from 'expo-router';
import { View } from 'react-native';

import { GlassBackground } from '@/components/ui/GlassBackground';

// Management screens live under Settings so the nav pill stays visible.
// Each screen paints its own background and slides in over the previous one; Android's
// default cross-fade would show both pages at once.
export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: 'transparent' },
      }}
      screenLayout={({ children }) => (
        <View style={{ flex: 1 }}>
          <GlassBackground />
          {children}
        </View>
      )}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="categories" />
      <Stack.Screen name="currencies" />
      <Stack.Screen name="recurring" />
      <Stack.Screen name="budgets" />
    </Stack>
  );
}
