import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import { useLeaderboardControllerGetLeaderboard } from '@/src/api/generated/api';
import type { LeaderboardEntryDto } from '@/src/api/generated/schemas';
import { getErrorMessage } from '@/src/api/customFetch';
import { Card, LoadingState, ScreenBackground, ScreenTitle } from '@/src/components/ui';
import { LEADERBOARD_TYPES, formatCash } from '@/src/constants/game';
import { COLORS, GRADIENTS, RADIUS, SPACING } from '@/src/constants/theme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];
const MEDALS = ['#F5C542', '#C0C7D1', '#CD7F32'];

function metric(type: string, e?: LeaderboardEntryDto | null): string {
  if (!e) return '';
  switch (type) {
    case 'empire': return `${formatCash(e?.empireValue ?? 0, 0)} · ${e?.businessCount ?? 0} biz`;
    case 'investment': return `${formatCash(e?.investmentReturns ?? 0, 0)} · ${e?.winRate ?? 0}%`;
    case 'reputation': return `${e?.reputation ?? 0} · ${e?.title ?? ''}`;
    case 'weekly': return `+${formatCash(e?.weeklyGrowth ?? 0, 0)}`;
    default: return `${formatCash(e?.netWorth ?? 0, 0)} · Lv ${e?.level ?? 1}`;
  }
}

export default function LeaderboardScreen() {
  const [type, setType] = useState<string>('networth');
  const q = useLeaderboardControllerGetLeaderboard(type, { limit: 50 });
  const { refetch } = q;
  useFocusEffect(useCallback(() => { refetch?.(); }, [refetch]));

  const entries = q.data?.entries ?? [];
  const myRank = q.data?.myRank ?? null;
  const top = entries.slice(0, 3);
  const rest = entries.slice(3);

  const header = (
    <>
      <ScreenTitle title="Leaderboards" subtitle="Who runs this city?" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.tabs}>
        {LEADERBOARD_TYPES.map((t) => {
          const on = t.key === type;
          return (
            <Pressable key={t.key} onPress={() => setType(t.key)} accessibilityRole="tab" accessibilityState={{ selected: on }} accessibilityLabel={t.label}
              style={[s.tab, on && s.tabOn]}>
              <Ionicons name={t.icon as IconName} size={15} color={on ? COLORS.bgDeep : COLORS.textSecondary} />
              <Text style={[s.tabText, on && { color: COLORS.bgDeep }]}>{t.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
      {myRank ? (
        <LinearGradient colors={GRADIENTS.violet} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.mine}>
          <Text style={s.mineRank}>#{myRank?.rank ?? '-'}</Text>
          <View style={{ flex: 1 }}>
            <Text style={s.mineLabel}>Your position</Text>
            <Text style={s.mineValue}>{metric(type, myRank)}</Text>
          </View>
          <Text style={s.avatar}>{myRank?.avatarEmoji ?? '😎'}</Text>
        </LinearGradient>
      ) : null}
      {top.length > 0 ? (
        <View style={s.podium}>
          {[1, 0, 2].map((i) => {
            const e = top[i];
            if (!e) return <View key={i} style={{ flex: 1 }} />;
            const h = i === 0 ? 120 : i === 1 ? 96 : 80;
            return (
              <View key={i} style={s.podCol}>
                <Text style={s.podAvatar}>{e?.avatarEmoji ?? '😎'}</Text>
                <Text style={s.podName} numberOfLines={1}>{e?.playerName ?? 'Player'}</Text>
                <Text style={s.podMetric} numberOfLines={1}>{metric(type, e).split(' · ')[0]}</Text>
                <View style={[s.podBar, { height: h, borderColor: MEDALS[i], backgroundColor: `${MEDALS[i]}22` }]}>
                  <Ionicons name="trophy" size={i === 0 ? 26 : 20} color={MEDALS[i]} />
                  <Text style={[s.podRank, { color: MEDALS[i] }]}>{i + 1}</Text>
                </View>
              </View>
            );
          })}
        </View>
      ) : null}
    </>
  );

  if (q.isLoading && !q.data) return <ScreenBackground><LoadingState /></ScreenBackground>;
  if (q.error && !q.data) return <ScreenBackground><LoadingState error={getErrorMessage(q.error)} onRetry={() => refetch?.()} /></ScreenBackground>;

  return (
    <ScreenBackground>
      <FlatList
        data={rest}
        keyExtractor={(e) => `${e?.userId}-${e?.rank}`}
        ListHeaderComponent={header}
        contentContainerStyle={s.content}
        refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => refetch?.()} tintColor={COLORS.gold} />}
        ListEmptyComponent={top.length === 0 ? <Card><Text style={s.empty}>No players ranked yet. Be the first boss!</Text></Card> : null}
        renderItem={({ item }) => <Row e={item} type={type} mine={item?.userId === myRank?.userId} />}
      />
    </ScreenBackground>
  );
}

const Row = React.memo(function Row({ e, type, mine }: { e: LeaderboardEntryDto; type: string; mine: boolean }) {
  return (
    <View style={[s.row, mine && { borderColor: COLORS.gold }]}>
      <Text style={s.rank}>#{e?.rank ?? '-'}</Text>
      <Text style={s.rowAvatar}>{e?.avatarEmoji ?? '😎'}</Text>
      <Text style={s.rowName} numberOfLines={1}>{e?.playerName ?? 'Player'}</Text>
      <Text style={s.rowMetric} numberOfLines={1}>{metric(type, e)}</Text>
    </View>
  );
});

const s = StyleSheet.create({
  content: { padding: SPACING.md, paddingBottom: 40 },
  tabs: { gap: 8, paddingBottom: SPACING.md },
  tab: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, height: 38, borderRadius: RADIUS.full, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.cardBorder },
  tabOn: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  tabText: { color: COLORS.textSecondary, fontWeight: '700', fontSize: 13 },
  mine: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: RADIUS.lg, marginBottom: SPACING.md },
  mineRank: { color: COLORS.white, fontSize: 26, fontWeight: '900' },
  mineLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  mineValue: { color: COLORS.white, fontSize: 15, fontWeight: '700', marginTop: 2 },
  avatar: { fontSize: 30 },
  podium: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: SPACING.md },
  podCol: { flex: 1, alignItems: 'center' },
  podAvatar: { fontSize: 34 },
  podName: { color: COLORS.white, fontWeight: '700', fontSize: 13, marginTop: 4, maxWidth: '100%' },
  podMetric: { color: COLORS.gold, fontSize: 12, fontWeight: '700', marginBottom: 6 },
  podBar: { width: '100%', borderTopLeftRadius: RADIUS.md, borderTopRightRadius: RADIUS.md, borderWidth: 1, borderBottomWidth: 0, alignItems: 'center', justifyContent: 'center', gap: 2 },
  podRank: { fontSize: 20, fontWeight: '900' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, marginBottom: 8, borderRadius: RADIUS.md, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.cardBorder },
  rank: { color: COLORS.textMuted, fontWeight: '800', width: 36 },
  rowAvatar: { fontSize: 22 },
  rowName: { color: COLORS.white, fontWeight: '600', flex: 1 },
  rowMetric: { color: COLORS.gold, fontWeight: '700', fontSize: 12.5, maxWidth: '45%' },
  empty: { color: COLORS.textSecondary, textAlign: 'center' },
});
