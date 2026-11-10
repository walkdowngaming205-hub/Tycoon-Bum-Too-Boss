import React from 'react';
import {
  ActivityIndicator, Image, Pressable, StyleSheet, Text, View,
  type ImageSourcePropType, type StyleProp, type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, GRADIENTS, RADIUS, SPACING } from '@/src/constants/theme';
import { haptic } from '@/src/contexts/GameContext';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export function ScreenBackground({ children }: { children: React.ReactNode }) {
  return (
    <LinearGradient colors={GRADIENTS.bg} style={styles.flex}>
      <View pointerEvents="none" style={styles.glowTop} />
      <View pointerEvents="none" style={styles.glowBottom} />
      <SafeAreaView edges={['top']} style={styles.flex}>{children}</SafeAreaView>
    </LinearGradient>
  );
}

export type ButtonVariant = 'gold' | 'green' | 'violet' | 'red' | 'cyan';

interface BtnProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: IconName;
  disabled?: boolean;
  loading?: boolean;
  small?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export function GradientButton({ title, onPress, variant = 'gold', icon, disabled, loading, small, style, accessibilityLabel }: BtnProps) {
  const colors = disabled ? GRADIENTS.disabled : GRADIENTS[variant];
  const fg = disabled ? COLORS.textMuted : variant === 'gold' ? '#1A1305' : '#FFFFFF';
  return (
    <Pressable
      onPress={() => { haptic('light'); onPress?.(); }}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.96 : 1 }] }, style]}
    >
      <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.btn, small && styles.btnSmall]}>
        {loading ? (
          <ActivityIndicator color={fg} size="small" />
        ) : (
          <View style={styles.row}>
            {icon ? <Ionicons name={icon} size={small ? 14 : 18} color={fg} style={{ marginRight: 6 }} /> : null}
            <Text numberOfLines={1} style={[styles.btnText, small && styles.btnTextSmall, { color: fg }]}>{title}</Text>
          </View>
        )}
      </LinearGradient>
    </Pressable>
  );
}

export function Card({ children, style, accent }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; accent?: string }) {
  return <View style={[styles.card, accent ? { borderColor: accent } : null, style]}>{children}</View>;
}

export function ProgressBar({ progress, colors = GRADIENTS.gold, height = 8, style }: { progress: number; colors?: readonly [string, string, ...string[]]; height?: number; style?: StyleProp<ViewStyle> }) {
  const p = Math.max(0, Math.min(1, Number.isFinite(progress) ? progress : 0));
  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }, style]}>
      <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ width: `${p * 100}%`, height: '100%', borderRadius: height / 2 }} />
    </View>
  );
}

export function StatPill({ icon, value, color = COLORS.gold, onPress }: { icon: IconName; value: string; color?: string; onPress?: () => void }) {
  const content = (
    <View style={[styles.pill, { borderColor: `${color}55` }]}>
      <Ionicons name={icon} size={14} color={color} />
      <Text style={[styles.pillText, { color }]}>{value}</Text>
    </View>
  );
  if (!onPress) return content;
  return <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={value}>{content}</Pressable>;
}

export function SectionHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.flex}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.sectionSub}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

export function ScreenTitle({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <View style={styles.screenTitleRow}>
      <View style={styles.flex}>
        <Text style={styles.screenTitle}>{title}</Text>
        {subtitle ? <Text style={styles.screenSub}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

export function ImageHero({ source, height = 170, children, style, dim }: { source?: ImageSourcePropType; height?: number; children?: React.ReactNode; style?: StyleProp<ViewStyle>; dim?: boolean }) {
  return (
    <View style={[styles.hero, { height }, style]}>
      {source ? <Image source={source} style={[StyleSheet.absoluteFillObject, styles.heroImg, dim && { opacity: 0.35 }]} resizeMode="cover" /> : null}
      <LinearGradient colors={GRADIENTS.imageFade} style={StyleSheet.absoluteFillObject} />
      <View style={styles.heroContent}>{children}</View>
    </View>
  );
}

export function Badge({ text, color = COLORS.gold, icon }: { text: string; color?: string; icon?: IconName }) {
  return (
    <View style={[styles.badge, { backgroundColor: `${color}26`, borderColor: `${color}66` }]}>
      {icon ? <Ionicons name={icon} size={11} color={color} style={{ marginRight: 3 }} /> : null}
      <Text style={[styles.badgeText, { color }]}>{text}</Text>
    </View>
  );
}

export function LoadingState({ error, onRetry }: { error?: string | null; onRetry?: () => void }) {
  return (
    <View style={styles.center}>
      {error ? (
        <>
          <Ionicons name="cloud-offline" size={48} color={COLORS.textMuted} />
          <Text style={styles.errorText}>{error}</Text>
          {onRetry ? <GradientButton title="Retry" icon="refresh" onPress={onRetry} style={{ marginTop: SPACING.md }} /> : null}
        </>
      ) : (
        <>
          <ActivityIndicator size="large" color={COLORS.gold} />
          <Text style={styles.loadingText}>Loading your empire…</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center' },
  glowTop: { position: 'absolute', top: -120, right: -80, width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(245,197,66,0.07)' },
  glowBottom: { position: 'absolute', bottom: -140, left: -100, width: 320, height: 320, borderRadius: 160, backgroundColor: 'rgba(124,58,237,0.08)' },
  btn: { minHeight: 48, paddingHorizontal: SPACING.md, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center' },
  btnSmall: { minHeight: 36, paddingHorizontal: 12, borderRadius: RADIUS.sm },
  btnText: { fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },
  btnTextSmall: { fontSize: 13 },
  card: { backgroundColor: COLORS.card, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.cardBorder, padding: SPACING.md },
  track: { backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden', width: '100%' },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: RADIUS.full, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1 },
  pillText: { fontSize: 13, fontWeight: '800' },
  section: { flexDirection: 'row', alignItems: 'flex-end', marginTop: SPACING.lg, marginBottom: SPACING.sm },
  sectionTitle: { color: COLORS.white, fontSize: 18, fontWeight: '800', letterSpacing: 0.2 },
  sectionSub: { color: COLORS.textMuted, fontSize: 12, marginTop: 2 },
  screenTitleRow: { flexDirection: 'row', alignItems: 'center', paddingTop: SPACING.sm, paddingBottom: SPACING.md },
  screenTitle: { color: COLORS.white, fontSize: 30, fontWeight: '900', letterSpacing: -0.5 },
  screenSub: { color: COLORS.textSecondary, fontSize: 13, marginTop: 2 },
  hero: { borderRadius: RADIUS.lg, overflow: 'hidden', backgroundColor: COLORS.cardSolid, borderWidth: 1, borderColor: COLORS.cardBorder },
  heroImg: { width: '100%', height: '100%', opacity: 0.9 },
  heroContent: { flex: 1, justifyContent: 'flex-end', padding: SPACING.md },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full, borderWidth: 1, alignSelf: 'flex-start' },
  badgeText: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl },
  errorText: { color: COLORS.textSecondary, textAlign: 'center', marginTop: SPACING.md, fontSize: 15 },
  loadingText: { color: COLORS.textSecondary, marginTop: SPACING.md },
});
