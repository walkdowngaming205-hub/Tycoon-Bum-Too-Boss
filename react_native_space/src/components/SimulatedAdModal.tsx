import React, { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, GRADIENTS, RADIUS, SPACING } from '@/src/constants/theme';
import { ProgressBar } from '@/src/components/ui';

const AD_SECONDS = 15;
const SKIP_AFTER = 5;

interface Props { onComplete: () => void; onSkip: () => void }

export default function SimulatedAdModal({ onComplete, onSkip }: Props) {
  const [elapsed, setElapsed] = useState(0);
  const done = useRef(false);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  useEffect(() => {
    const start = Date.now();
    const t = setInterval(() => {
      const e = (Date.now() - start) / 1000;
      setElapsed(e);
      if (e >= AD_SECONDS && !done.current) {
        done.current = true;
        clearInterval(t);
        completeRef.current?.();
      }
    }, 100);
    return () => clearInterval(t);
  }, []);

  const canSkip = elapsed >= SKIP_AFTER;
  return (
    <Modal visible transparent animationType="fade" onRequestClose={() => canSkip && onSkip?.()}>
      <View style={s.overlay}>
        <LinearGradient colors={['#1F1B3A', '#0E0E1A']} style={s.card}>
          <View style={s.top}>
            <Text style={s.sponsored}>SPONSORED</Text>
            {canSkip ? (
              <Pressable onPress={onSkip} accessibilityRole="button" accessibilityLabel="Skip ad (no reward)" style={s.skip}>
                <Text style={s.skipText}>Skip</Text>
                <Ionicons name="close" size={16} color={COLORS.textSecondary} />
              </Pressable>
            ) : (
              <Text style={s.skipText}>Skip in {Math.ceil(SKIP_AFTER - elapsed)}s</Text>
            )}
          </View>
          <Ionicons name="play-circle" size={72} color={COLORS.gold} style={{ marginVertical: SPACING.lg }} />
          <Text style={s.title}>Your reward is loading</Text>
          <Text style={s.sub}>Watch to the end to collect it</Text>
          <ProgressBar progress={elapsed / AD_SECONDS} colors={GRADIENTS.gold} style={{ marginTop: SPACING.lg }} />
          <Text style={s.timer}>{Math.max(0, Math.ceil(AD_SECONDS - elapsed))}s</Text>
        </LinearGradient>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', justifyContent: 'center', alignItems: 'center', padding: SPACING.lg },
  card: { width: '100%', maxWidth: 380, borderRadius: RADIUS.xl, padding: SPACING.lg, alignItems: 'center', borderWidth: 1, borderColor: COLORS.cardBorder },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  sponsored: { color: COLORS.textMuted, fontSize: 11, fontWeight: '800', letterSpacing: 2 },
  skip: { flexDirection: 'row', alignItems: 'center', gap: 4, padding: 6 },
  skipText: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '700' },
  title: { color: COLORS.white, fontSize: 20, fontWeight: '800' },
  sub: { color: COLORS.textSecondary, fontSize: 13, marginTop: 4 },
  timer: { color: COLORS.textSecondary, marginTop: SPACING.sm, fontWeight: '700' },
});
