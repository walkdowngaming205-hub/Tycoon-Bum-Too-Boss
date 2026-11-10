import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { COLORS, SPACING } from '@/src/constants/theme';

export default function NotFound() {
  return (
    <View style={s.c}>
      <Text style={s.emoji}>😵</Text>
      <Text style={s.t}>Page Not Found</Text>
      <Link href="/" style={s.link}>Go Home</Link>
    </View>
  );
}

const s = StyleSheet.create({
  c: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bg },
  emoji: { fontSize: 64, marginBottom: SPACING.md },
  t: { fontSize: 22, color: COLORS.white, fontWeight: '700', marginBottom: SPACING.md },
  link: { fontSize: 16, color: COLORS.gold, fontWeight: '600' },
});
