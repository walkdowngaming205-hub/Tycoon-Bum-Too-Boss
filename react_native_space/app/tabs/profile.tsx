import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useGame } from '@/src/contexts/GameContext';
import { useAuth } from '@/src/contexts/AuthContext';
import { gameControllerSpendBossCoins } from '@/src/api/generated/api';
import { Card, GradientButton, LoadingState, ProgressBar, ScreenBackground, SectionHeader } from '@/src/components/ui';
import { ACHIEVEMENTS, BOSS_COIN_ITEMS, BUSINESS_MAP, formatCash } from '@/src/constants/game';
import { COLORS, GRADIENTS, RADIUS, SPACING } from '@/src/constants/theme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export default function ProfileScreen() {
  const { data, gs, loading, loadError, refresh, act, busyKey } = useGame();
  const { logout } = useAuth();
  const [renameOpen, setRenameOpen] = useState(false);
  const [targetId, setTargetId] = useState<number | null>(null);
  const [newName, setNewName] = useState('');

  if (!gs) return <ScreenBackground><LoadingState error={loading ? null : loadError} onRetry={refresh} /></ScreenBackground>;

  const achievements = data?.achievements ?? [];
  const doneCount = achievements.filter((a) => a?.completed).length;
  const businesses = data?.businesses ?? [];
  const coins = gs.bossCoins ?? 0;
  const boostActive = gs.xpBoostUntil ? new Date(gs.xpBoostUntil).getTime() > Date.now() : false;

  const buy = (key: (typeof BOSS_COIN_ITEMS)[number]['key']) => {
    if (key === 'business_rename') { setTargetId(businesses?.[0]?.id ?? null); setNewName(''); setRenameOpen(true); return; }
    act(`coin-${key}`, () => gameControllerSpendBossCoins({ itemKey: key }));
  };

  const submitRename = async () => {
    if (!targetId || !newName.trim()) return;
    const res = await act('coin-business_rename', () => gameControllerSpendBossCoins({ itemKey: 'business_rename', targetBusinessId: targetId, newName: newName.trim() }));
    if (res?.success) setRenameOpen(false);
  };

  const stats: { label: string; value: string; icon: IconName; color: string }[] = [
    { label: 'Net worth', value: formatCash(gs.netWorth ?? 0), icon: 'wallet', color: COLORS.gold },
    { label: 'Total earned', value: formatCash(gs.totalEarned ?? 0), icon: 'cash', color: COLORS.green },
    { label: 'Reputation', value: `${gs.reputation ?? 0}`, icon: 'shield-checkmark', color: COLORS.violet },
    { label: 'Hustles', value: `${gs.totalHustleTaps ?? 0}`, icon: 'flash', color: COLORS.cyan },
    { label: 'Businesses', value: `${businesses.length}`, icon: 'storefront', color: COLORS.orange },
    { label: 'Streak', value: `${gs.dailyStreak ?? 0} days`, icon: 'calendar', color: COLORS.red },
  ];

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.topBar}>
          <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace('/tabs/home'))} style={s.iconBtn} accessibilityRole="button" accessibilityLabel="Back">
            <Ionicons name="chevron-back" size={22} color={COLORS.white} />
          </Pressable>
          <Text style={s.topTitle}>Profile</Text>
          <View style={{ width: 44 }} />
        </View>

        <Card style={s.hero}>
          <View style={[s.avatarRing, data?.hasAvatarFrame && { borderColor: COLORS.gold, borderWidth: 3 }]}>
            <Text style={s.avatar}>{data?.avatarEmoji ?? '😎'}</Text>
          </View>
          <Text style={s.name}>{data?.playerName ?? 'Boss'}</Text>
          <Text style={s.rank}>{gs.rankTitle ?? 'Bum'} · Level {gs.level ?? 1}</Text>
          <ProgressBar progress={(gs.xp ?? 0) / Math.max(1, gs.xpToNext ?? 1)} style={{ alignSelf: 'stretch', marginTop: 12 }} />
          <Text style={s.muted}>{gs.xp ?? 0} / {gs.xpToNext ?? 0} XP{boostActive ? ' · 2× XP active' : ''}</Text>
        </Card>

        <View style={s.grid}>
          {stats.map((st) => (
            <Card key={st.label} style={s.statCard}>
              <Ionicons name={st.icon} size={18} color={st.color} />
              <Text style={s.statValue} numberOfLines={1}>{st.value}</Text>
              <Text style={s.muted}>{st.label}</Text>
            </Card>
          ))}
        </View>

        <SectionHeader title="Boss Coin Store" subtitle="Cosmetics & convenience — never pay-to-win" right={<Text style={s.coins}>💎 {coins}</Text>} />
        {BOSS_COIN_ITEMS.map((it) => {
          const owned = (it.key === 'avatar_frame' && data?.hasAvatarFrame) || (it.key === 'offline_boost' && (gs.offlineMaxHours ?? 0) >= 8);
          const disabled = owned || coins < it.cost || (it.key === 'business_rename' && businesses.length === 0);
          return (
            <Card key={it.key} style={s.storeRow}>
              <View style={s.storeIcon}><Ionicons name={it.icon as IconName} size={22} color={COLORS.cyan} /></View>
              <View style={{ flex: 1 }}>
                <Text style={s.itemName}>{it.name}</Text>
                <Text style={s.muted}>{it.description}</Text>
              </View>
              <GradientButton small variant="cyan" title={owned ? 'Owned' : `${it.cost} 💎`} disabled={disabled}
                loading={busyKey === `coin-${it.key}`} onPress={() => buy(it.key)} />
            </Card>
          );
        })}

        <SectionHeader title="Achievements" subtitle={`${doneCount} / ${Object.keys(ACHIEVEMENTS).length} unlocked`} />
        <View style={s.grid}>
          {Object.entries(ACHIEVEMENTS).map(([key, def]) => {
            const a = achievements.find((x) => x?.achievementKey === key);
            const done = !!a?.completed;
            const prog = Math.min(1, (a?.progress ?? 0) / Math.max(1, def.target));
            return (
              <Card key={key} style={[s.achCard, done && { borderColor: COLORS.gold }]}>
                <Ionicons name={def.icon as IconName} size={24} color={done ? COLORS.gold : COLORS.textMuted} />
                <Text style={[s.achTitle, !done && { color: COLORS.textSecondary }]} numberOfLines={1}>{def.title}</Text>
                <Text style={s.achDesc} numberOfLines={2}>{def.description}</Text>
                {!done ? <ProgressBar progress={prog} height={5} style={{ alignSelf: 'stretch', marginTop: 6 }} /> : <Text style={s.achDone}>✓ Done</Text>}
              </Card>
            );
          })}
        </View>

        <GradientButton title="Log out" icon="log-out-outline" variant="red" onPress={() => { logout?.(); }} style={{ marginTop: SPACING.lg }} />
        <View style={{ height: 40 }} />
      </ScrollView>

      <Modal visible={renameOpen} transparent animationType="fade" onRequestClose={() => setRenameOpen(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.modalWrap}>
          <View style={s.modal}>
            <Text style={s.modalTitle}>Rename a business</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 8 }}>
              {businesses.map((b) => {
                const on = b?.id === targetId;
                return (
                  <Pressable key={b.id} onPress={() => setTargetId(b.id)} style={[s.chip, on && s.chipOn]} accessibilityRole="button">
                    <Text style={[s.chipText, on && { color: COLORS.bgDeep }]}>{b?.customName ?? BUSINESS_MAP[b?.businessType ?? '']?.name ?? b?.businessType}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
            <TextInput value={newName} onChangeText={setNewName} placeholder="New name" placeholderTextColor={COLORS.textMuted} maxLength={30}
              style={s.input} accessibilityLabel="New business name" />
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
              <GradientButton title="Cancel" variant="violet" onPress={() => setRenameOpen(false)} style={{ flex: 1 }} />
              <GradientButton title="Rename · 10 💎" disabled={!newName.trim() || !targetId} loading={busyKey === 'coin-business_rename'} onPress={submitRename} style={{ flex: 1 }} />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScreenBackground>
  );
}

const s = StyleSheet.create({
  content: { padding: SPACING.md, paddingBottom: 40 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.md },
  iconBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.card },
  topTitle: { color: COLORS.white, fontSize: 18, fontWeight: '800' },
  hero: { alignItems: 'center', paddingVertical: SPACING.lg },
  avatarRing: { width: 92, height: 92, borderRadius: 46, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.cardElevated, borderWidth: 1, borderColor: COLORS.cardBorder },
  avatar: { fontSize: 48 },
  name: { color: COLORS.white, fontSize: 22, fontWeight: '800', marginTop: 10 },
  rank: { color: COLORS.gold, fontWeight: '700', marginTop: 2 },
  muted: { color: COLORS.textMuted, fontSize: 12, marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: SPACING.md },
  statCard: { width: '31.5%', paddingVertical: 12, alignItems: 'center' },
  statValue: { color: COLORS.white, fontWeight: '800', fontSize: 14, marginTop: 6 },
  coins: { color: COLORS.cyan, fontWeight: '800', fontSize: 15 },
  storeRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  storeIcon: { width: 42, height: 42, borderRadius: RADIUS.md, backgroundColor: 'rgba(34,211,238,0.12)', alignItems: 'center', justifyContent: 'center' },
  itemName: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
  achCard: { width: '48.5%', padding: 12 },
  achTitle: { color: COLORS.white, fontWeight: '700', marginTop: 6 },
  achDesc: { color: COLORS.textMuted, fontSize: 11.5, marginTop: 2 },
  achDone: { color: COLORS.gold, fontWeight: '700', fontSize: 12, marginTop: 6 },
  modalWrap: { flex: 1, backgroundColor: COLORS.overlay, justifyContent: 'center', padding: SPACING.lg },
  modal: { backgroundColor: COLORS.cardSolid, borderRadius: RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.cardBorder },
  modalTitle: { color: COLORS.white, fontSize: 18, fontWeight: '800' },
  chip: { paddingHorizontal: 12, height: 36, justifyContent: 'center', borderRadius: RADIUS.full, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.cardBorder },
  chipOn: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  chipText: { color: COLORS.textSecondary, fontWeight: '600' },
  input: { marginTop: 8, height: 48, borderRadius: RADIUS.md, paddingHorizontal: 14, color: COLORS.white, backgroundColor: COLORS.bgDeep, borderWidth: 1, borderColor: COLORS.cardBorder },
});
