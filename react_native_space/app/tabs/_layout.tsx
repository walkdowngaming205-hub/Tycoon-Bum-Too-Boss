import React from 'react';
import { Tabs, Redirect } from 'expo-router';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/src/contexts/AuthContext';
import { GameProvider } from '@/src/contexts/GameContext';
import GameOverlays from '@/src/components/GameOverlays';
import { COLORS } from '@/src/constants/theme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];
const icon = (name: IconName) => ({ color, focused }: { color: string; focused: boolean }) => (
  <Ionicons name={(focused ? name : `${name}-outline`) as IconName} size={23} color={color} />
);

export default function TabsLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const insets = useSafeAreaInsets();

  if (isLoading) return <View style={s.splash}><ActivityIndicator size="large" color={COLORS.gold} /></View>;
  if (!isAuthenticated) return <Redirect href="/auth/login" />;

  return (
    <GameProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Platform.OS === 'web' ? 'rgba(10,10,20,0.96)' : '#0A0A14',
            borderTopColor: 'rgba(245,197,66,0.15)',
            borderTopWidth: 1,
            paddingBottom: insets.bottom,
            height: 62 + insets.bottom,
            paddingTop: 6,
          },
          tabBarActiveTintColor: COLORS.gold,
          tabBarInactiveTintColor: COLORS.textMuted,
          tabBarLabelStyle: { fontSize: 10, fontWeight: '700' },
        }}
      >
        <Tabs.Screen name="home" options={{ title: 'Empire', tabBarIcon: icon('home'), tabBarButtonTestID: 'tab-home' }} />
        <Tabs.Screen name="hustle" options={{ title: 'Hustle', tabBarIcon: icon('flash'), tabBarButtonTestID: 'tab-hustle' }} />
        <Tabs.Screen name="business" options={{ title: 'Business', tabBarIcon: icon('storefront'), tabBarButtonTestID: 'tab-business' }} />
        <Tabs.Screen name="city" options={{ title: 'City', tabBarIcon: icon('business'), tabBarButtonTestID: 'tab-city' }} />
        <Tabs.Screen name="invest" options={{ title: 'Invest', tabBarIcon: icon('trending-up'), tabBarButtonTestID: 'tab-invest' }} />
        <Tabs.Screen name="leaderboard" options={{ title: 'Ranks', tabBarIcon: icon('trophy'), tabBarButtonTestID: 'tab-leaderboard' }} />
        <Tabs.Screen name="profile" options={{ href: null }} />
      </Tabs>
      <GameOverlays />
    </GameProvider>
  );
}

const s = StyleSheet.create({ splash: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bg } });
