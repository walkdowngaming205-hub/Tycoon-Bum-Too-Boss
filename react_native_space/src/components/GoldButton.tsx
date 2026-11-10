import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, type StyleProp, type ViewStyle } from 'react-native';
import { COLORS, RADIUS, SPACING } from '@/src/constants/theme';

interface Props {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'gold' | 'green' | 'violet' | 'red' | 'outline';
  style?: StyleProp<ViewStyle>;
}

export default function GoldButton({ title, onPress, disabled, loading, variant = 'gold', style }: Props) {
  const bgColor = disabled
    ? '#444'
    : variant === 'gold'
    ? COLORS.gold
    : variant === 'green'
    ? COLORS.green
    : variant === 'violet'
    ? COLORS.violet
    : variant === 'red'
    ? COLORS.red
    : 'transparent';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: bgColor },
        variant === 'outline' ? { borderWidth: 1.5, borderColor: COLORS.gold } : {},
        pressed && !disabled ? { transform: [{ scale: 0.95 }], opacity: 0.85 } : {},
        disabled ? { opacity: 0.5 } : {},
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? COLORS.gold : '#000'} />
      ) : (
        <Text style={[styles.text, variant === 'outline' ? { color: COLORS.gold } : { color: variant === 'gold' ? '#000' : '#fff' }]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 14,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
  },
});
