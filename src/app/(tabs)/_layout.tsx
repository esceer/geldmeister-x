import { BlurTargetView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { useRef, type ComponentRef } from 'react';
import { View } from 'react-native';

import { TabBar } from '@/components/TabBar';
import { GlassBackground } from '@/components/ui/GlassBackground';

// The nav pill lives outside the blur target so it can blur the screens behind it.
export default function TabsLayout() {
  const blurTarget = useRef<ComponentRef<typeof View>>(null);

  return (
    <View style={{ flex: 1 }}>
      <BlurTargetView ref={blurTarget} style={{ flex: 1 }}>
        <GlassBackground />
        <Tabs
          tabBar={() => null}
          screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: 'transparent' } }}
        >
          <Tabs.Screen name="index" />
          <Tabs.Screen name="expenses" />
          <Tabs.Screen name="reports" />
          <Tabs.Screen name="settings" />
        </Tabs>
      </BlurTargetView>
      <TabBar blurTarget={blurTarget} />
    </View>
  );
}
