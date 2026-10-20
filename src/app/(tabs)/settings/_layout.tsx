import { Stack } from 'expo-router';

// Management screens live under Settings so the nav pill stays visible.
export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="categories" />
      <Stack.Screen name="recurring" />
    </Stack>
  );
}
