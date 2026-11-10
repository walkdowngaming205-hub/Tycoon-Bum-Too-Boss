import { Redirect } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '@/src/constants/theme';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <View style={s.c}><ActivityIndicator size="large" color={COLORS.gold} /></View>;
  if (isAuthenticated) return <Redirect href="/tabs/home" />;
  return <Redirect href="/auth/login" />;
}

const s = StyleSheet.create({ c: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bg } });
