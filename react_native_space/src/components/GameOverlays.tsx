import React, { useState } from 'react';
import { Modal, StyleSheet, Text, View, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGame } from '@/src/contexts/GameContext';
import {
  gameControllerClaimDaily, gameControllerCollectOffline, gameControllerResolveEvent,
} from '@/src/api/generated/api';
import { DAILY_REWARDS, formatCash, formatTime, RANKS } from '@/src/constants/game';
import { COLORS, GRADIENTS, RADIUS, SPACING } from '@/src/constants/theme';
import { GradientButton } from '@/src/components/ui';
import SimulatedAdModal from '@/src/components/SimulatedAdModal';

function Sheet({ children, onClose }: { children: React.ReactNode; onClose?: () => void }) {
  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.overlay}>
        <LinearGradient colors={['#22203D', '#121224']} style={s.sheet}>{children}</LinearGradient>
      </View>
    </Modal>
  );
}

function Toasts() {
  const { toasts } = useGame();
  const insets = useSafeAreaInsets();
  if ((toasts?.length ?? 0) === 0) return null;
  return (
    <View pointerEvents="none" style={[s.toastWrap, { top: insets.top + 8 }]}>
      {(toasts ?? []).map((t) => {
        const color = t.kind === 'error' ? COLORS.red : t.kind === 'success' ? COLORS.green : t.kind === 'gold' ? COLORS.gold : COLORS.cyan;
        return (
          <View key={t.id} style={[s.toast, { borderColor: `${color}88` }]}>
            <View style={[s.toastDot, { backgroundColor: color }]} />
            <Text style={s.toastText} numberOfLines={3}>{t.text}</Text>
          </View>
        );
      })}
    </View>
  );
}

function LevelUp() {
  const { levelUp, clearLevelUp } = useGame();
  if (!levelUp) return null;
  return (
    <Sheet onClose={clearLevelUp}>
      <LinearGradient colors={GRADIENTS.gold} style={s.levelBadge}>
        <Text style={s.levelNum}>{levelUp}</Text>
      </LinearGradient>
      <Text style={s.title}>LEVEL UP!</Text>
      <Text style={s.body}>New hustles, businesses and investments may now be unlocked. Keep climbing.</Text>
      <GradientButton title="Let's go" icon="rocket" onPress={clearLevelUp} style={s.fullBtn} />
    </Sheet>
  );
}

function WelcomeBack() {
  const { data, act, watchAd, busyKey, adRequest } = useGame();
  const off = data?.offlineIncome;
  const [dismissed, setDismissed] = useState(false);
  if (!off || (off.amount ?? 0) <= 0 || dismissed || adRequest) return null;
  return (
    <Sheet onClose={() => setDismissed(true)}>
      <Ionicons name="moon" size={44} color={COLORS.gold} />
      <Text style={s.title}>Welcome back, Boss</Text>
      <Text style={s.body}>Your empire kept earning for {formatTime(off.secondsAway ?? 0)} (cap {off.cappedAtHours ?? 2}h).</Text>
      <Text style={s.bigCash}>{formatCash(off.amount)}</Text>
      <GradientButton title={`Collect 2×  (${formatCash((off.amount ?? 0) * 2)})`} icon="play-circle" variant="violet" onPress={() => watchAd('offline_double')} style={s.fullBtn} />
      <GradientButton title="Collect" icon="cash" loading={busyKey === 'offline'} onPress={() => act('offline', () => gameControllerCollectOffline())} style={s.fullBtnSm} />
      <Pressable onPress={() => setDismissed(true)} accessibilityRole="button"><Text style={s.later}>Later</Text></Pressable>
    </Sheet>
  );
}

function EventPrompt() {
  const { data, act, busyKey, adRequest, gs } = useGame();
  const ev = data?.pendingEvent;
  const [protectChoice, setProtectChoice] = useState<number | null>(null);
  const [protect, setProtect] = useState(false);
  if (!ev || adRequest || data?.offlineIncome) return null;
  const adsLeft = (gs?.maxAdsPerDay ?? 10) - (gs?.adCountToday ?? 0);

  const resolve = (i: number, adProtection: boolean) =>
    act('event', () => gameControllerResolveEvent({ choiceIndex: i, adProtection }));

  return (
    <>
      <Sheet>
        <View style={s.eventTag}><Ionicons name="flash" size={12} color={COLORS.orange} /><Text style={s.eventTagText}>CITY EVENT</Text></View>
        <Text style={s.title}>{ev.title ?? 'Something happened'}</Text>
        <Text style={s.body}>{ev.description ?? ''}</Text>
        {adsLeft > 0 ? (
          <Pressable onPress={() => setProtect((p) => !p)} style={s.protectRow} accessibilityRole="checkbox" accessibilityState={{ checked: protect }}>
            <Ionicons name={protect ? 'checkbox' : 'square-outline'} size={20} color={COLORS.violet} />
            <Text style={s.protectText}>Watch an ad to halve any losses</Text>
          </Pressable>
        ) : null}
        {(ev.choices ?? []).map((c, i) => (
          <Pressable
            key={`${c}-${i}`}
            disabled={busyKey === 'event'}
            onPress={() => (protect ? setProtectChoice(i) : resolve(i, false))}
            style={({ pressed }) => [s.choice, pressed && { opacity: 0.7 }]}
            accessibilityRole="button"
            accessibilityLabel={c}
          >
            <Text style={s.choiceLetter}>{String.fromCharCode(65 + i)}</Text>
            <Text style={s.choiceText}>{c}</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </Pressable>
        ))}
      </Sheet>
      {protectChoice !== null ? (
        <SimulatedAdModal
          onComplete={() => { const i = protectChoice; setProtectChoice(null); setProtect(false); resolve(i, true); }}
          onSkip={() => setProtectChoice(null)}
        />
      ) : null}
    </>
  );
}

function DailyReward() {
  const { gs, dailyOpen, setDailyOpen, act, watchAd, busyKey } = useGame();
  if (!dailyOpen || !gs) return null;
  const next = gs.nextDailyDay ?? 1;
  const available = !!gs.dailyAvailable;
  const base = Math.round(100 * Math.pow(1.4, Math.max(1, gs.level ?? 1) - 1));
  return (
    <Sheet onClose={() => setDailyOpen(false)}>
      <Ionicons name="gift" size={40} color={COLORS.gold} />
      <Text style={s.title}>Daily Rewards</Text>
      <Text style={s.body}>Streak: {gs.dailyStreak ?? 0} day{(gs.dailyStreak ?? 0) === 1 ? '' : 's'} · rewards scale with your level</Text>
      <View style={s.dailyGrid}>
        {DAILY_REWARDS.map((d) => {
          const isNext = d.day === next;
          const claimed = d.day < next;
          return (
            <View key={d.day} style={[s.dailyCell, d.day === 7 && s.dailyCellWide, isNext && available && s.dailyCellActive, claimed && { opacity: 0.45 }]}>
              <Text style={s.dailyDay}>Day {d.day}</Text>
              <Ionicons name={claimed ? 'checkmark-circle' : d.coins > 0 ? 'diamond' : 'cash'} size={20} color={claimed ? COLORS.green : d.coins > 0 ? COLORS.cyan : COLORS.gold} />
              <Text style={s.dailyAmt}>{formatCash(base * d.cashMult, 1)}</Text>
              {d.coins > 0 ? <Text style={s.dailyCoins}>+{d.coins}💎</Text> : null}
            </View>
          );
        })}
      </View>
      {available ? (
        <>
          <GradientButton title="Claim 2× with ad" icon="play-circle" variant="violet" onPress={() => { setDailyOpen(false); watchAd('daily_double'); }} style={s.fullBtn} />
          <GradientButton
            title={`Claim Day ${next}`}
            icon="gift"
            loading={busyKey === 'daily'}
            onPress={async () => { await act('daily', () => gameControllerClaimDaily()); setDailyOpen(false); }}
            style={s.fullBtnSm}
          />
        </>
      ) : (
        <Text style={s.body}>Come back tomorrow for Day {next}.</Text>
      )}
      <Pressable onPress={() => setDailyOpen(false)} accessibilityRole="button"><Text style={s.later}>Close</Text></Pressable>
    </Sheet>
  );
}

function AdHost() {
  const { adRequest, completeAd, cancelAd } = useGame();
  if (!adRequest) return null;
  return <SimulatedAdModal onComplete={completeAd} onSkip={cancelAd} />;
}

export default function GameOverlays() {
  return (
    <>
      <WelcomeBack />
      <EventPrompt />
      <DailyReward />
      <LevelUp />
      <AdHost />
      <Toasts />
    </>
  );
}

export const RANK_ICONS = RANKS;

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: COLORS.overlay, justifyContent: 'center', alignItems: 'center', padding: SPACING.lg },
  sheet: { width: '100%', maxWidth: 400, borderRadius: RADIUS.xl, padding: SPACING.lg, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(245,197,66,0.25)' },
  title: { color: COLORS.white, fontSize: 24, fontWeight: '900', textAlign: 'center', marginTop: SPACING.sm },
  body: { color: COLORS.textSecondary, fontSize: 14, textAlign: 'center', marginTop: SPACING.sm, lineHeight: 20 },
  bigCash: { color: COLORS.gold, fontSize: 40, fontWeight: '900', marginVertical: SPACING.md },
  fullBtn: { width: '100%', marginTop: SPACING.md },
  fullBtnSm: { width: '100%', marginTop: SPACING.sm },
  later: { color: COLORS.textMuted, marginTop: SPACING.md, fontWeight: '700', padding: 6 },
  levelBadge: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center' },
  levelNum: { fontSize: 44, fontWeight: '900', color: '#1A1305' },
  eventTag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(249,115,22,0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full },
  eventTagText: { color: COLORS.orange, fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  protectRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: SPACING.md, alignSelf: 'flex-start', paddingVertical: 4 },
  protectText: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '600' },
  choice: { flexDirection: 'row', alignItems: 'center', width: '100%', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: RADIUS.md, padding: SPACING.md, marginTop: SPACING.sm, borderWidth: 1, borderColor: COLORS.cardBorder, minHeight: 52 },
  choiceLetter: { color: COLORS.gold, fontWeight: '900', fontSize: 16, width: 24 },
  choiceText: { color: COLORS.white, flex: 1, fontSize: 15, fontWeight: '600' },
  dailyGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: SPACING.md },
  dailyCell: { width: '22%', minWidth: 68, alignItems: 'center', paddingVertical: 10, borderRadius: RADIUS.md, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: COLORS.cardBorder },
  dailyCellWide: { width: '47%' },
  dailyCellActive: { borderColor: COLORS.gold, backgroundColor: 'rgba(245,197,66,0.12)' },
  dailyDay: { color: COLORS.textSecondary, fontSize: 11, fontWeight: '700', marginBottom: 4 },
  dailyAmt: { color: COLORS.white, fontSize: 13, fontWeight: '800', marginTop: 2 },
  dailyCoins: { color: COLORS.cyan, fontSize: 11, fontWeight: '800' },
  toastWrap: { position: 'absolute', left: 16, right: 16, alignItems: 'center', gap: 6, zIndex: 999 },
  toast: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(20,20,38,0.97)', borderWidth: 1, borderRadius: RADIUS.md, paddingVertical: 10, paddingHorizontal: 14, maxWidth: 420, width: '100%' },
  toastDot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  toastText: { color: COLORS.white, fontSize: 14, fontWeight: '600', flex: 1 },
});
