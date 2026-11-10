import React from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useGame } from '@/src/contexts/GameContext';
import { Card, ImageHero, LoadingState, ProgressBar, ScreenBackground, SectionHeader, StatPill } from '@/src/components/ui';
import { DISTRICTS, IMAGES, formatCash, formatTime, rankProgress, INVESTMENT_MAP } from '@/src/constants/game';
import { COLORS, GRADIENTS, RADIUS, SPACING } from '@/src/constants/theme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export default function HomeScreen() {
  const { data, gs, loading, loadError, refresh, displayCash, displayEnergy, setDailyOpen } = useGame();
  const [refreshing, setRefreshing] = React.useState(false);

  if (!gs) return <ScreenBackground><LoadingState error={loading ? null : loadError} onRetry={refresh} /></ScreenBackground>;

  const unlocked = gs.unlockedDistricts ?? ['neighborhood'];
  const topDistrict = [...DISTRICTS].reverse().find((d) => unlocked.includes(d.key)) ?? DISTRICTS[0];
  const { current, next, progress } = rankProgress(gs.netWorth ?? 0);
  const active = (data?.investments ?? []).filter((i) => i.status === 'active');
  const now = Date.now();

  const onRefresh = async () => { setRefreshing(true); await refresh(); setRefreshing(false); };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={s.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.gold} />}>
        <View style={s.header}>
          <Pressable onPress={() => router.push('/tabs/profile')} accessibilityRole="button" accessibilityLabel="Open profile" style={s.headerLeft}>
            <View style={[s.avatar, data?.hasAvatarFrame && s.avatarGold]}>
              <Text style={s.avatarEmoji}>{data?.avatarEmoji ?? '😎'}</Text>
            </View>
            <View style={{ flexShrink: 1 }}>
              <Text style={s.name} numberOfLines={1}>{data?.playerName ?? 'Boss'}</Text>
              <Text style={s.rank}>{current.icon} {gs.rankTitle ?? current.title} · Lv {gs.level}</Text>
            </View>
          </Pressable>
          <StatPill icon="diamond" value={`${gs.bossCoins ?? 0}`} color={COLORS.cyan} onPress={() => router.push('/tabs/profile')} />
        </View>

        <ImageHero source={IMAGES[topDistrict.image]} height={210}>
          <Text style={s.heroLabel}>{topDistrict.name.toUpperCase()} · CASH</Text>
          <Text style={s.cash} numberOfLines={1} adjustsFontSizeToFit>{formatCash(displayCash)}</Text>
          <View style={s.heroRow}>
            <View style={s.incomeChip}>
              <Ionicons name="trending-up" size={14} color={COLORS.green} />
              <Text style={s.incomeText}>+{formatCash(gs.passiveIncomePerSecond)}/s</Text>
            </View>
            <Text style={s.netWorth}>Net worth {formatCash(gs.netWorth)}</Text>
          </View>
        </ImageHero>

        <Card style={s.mt}>
          <View style={s.rowBetween}>
            <Text style={s.cardLabel}>RANK PROGRESS</Text>
            <Text style={s.cardHint}>{next ? `${Math.floor(progress * 100)}%` : 'MAX'}</Text>
          </View>
          <View style={[s.rowBetween, { marginVertical: 10 }]}>
            <Text style={s.rankNow}>{current.icon} {current.title}</Text>
            {next ? <Text style={s.rankNext}>{next.icon} {next.title} · {formatCash(next.minNetWorth, 0)}</Text> : null}
          </View>
          <ProgressBar progress={progress} height={10} />
          <View style={[s.rowBetween, { marginTop: 14 }]}>
            <Text style={s.cardLabel}>LEVEL {gs.level} XP</Text>
            <Text style={s.cardHint}>{Math.floor(gs.xp ?? 0)} / {gs.xpToNext ?? 0}</Text>
          </View>
          <ProgressBar progress={(gs.xp ?? 0) / Math.max(1, gs.xpToNext ?? 1)} colors={GRADIENTS.violet} height={6} style={{ marginTop: 6 }} />
        </Card>

        {gs.dailyAvailable ? (
          <Pressable onPress={() => setDailyOpen(true)} accessibilityRole="button" accessibilityLabel="Claim daily reward" style={s.mt}>
            <LinearGradient colors={['#F59E0B', '#B45309']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.dailyBanner}>
              <Ionicons name="gift" size={30} color="#1A1305" />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={s.dailyTitle}>Daily reward ready!</Text>
                <Text style={s.dailySub}>Day {gs.nextDailyDay} · {gs.dailyStreak ?? 0}-day streak</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color="#1A1305" />
            </LinearGradient>
          </Pressable>
        ) : null}

        <SectionHeader title="Empire Dashboard" subtitle="Live income breakdown" />
        <View style={s.grid}>
          <Stat icon="storefront" label="Business" value={`${formatCash(gs.businessIncomePerSecond)}/s`} color={COLORS.green} />
          <Stat icon="home" label="Rent" value={`${formatCash(gs.rentIncomePerSecond)}/s`} color={COLORS.cyan} />
          <Stat icon="shield-checkmark" label="Reputation" value={`${gs.reputation ?? 0}/100`} color={COLORS.violet} />
          <Stat icon="card" label="Debt" value={formatCash(gs.debt)} color={(gs.debt ?? 0) > 0 ? COLORS.red : COLORS.textSecondary} />
          <Stat icon="rocket" label="Multiplier" value={`×${(gs.globalMultiplier ?? 1).toFixed(2)}`} color={COLORS.gold} />
          <Stat icon="cash" label="Total earned" value={formatCash(gs.totalEarned)} color={COLORS.gold} />
        </View>

        <Card style={s.mt}>
          <View style={s.rowBetween}>
            <View style={s.row}><Ionicons name="flash" size={16} color={COLORS.gold} /><Text style={[s.cardLabel, { marginLeft: 6 }]}>ENERGY</Text></View>
            <Text style={s.cardHint}>{displayEnergy}/{gs.maxEnergy}</Text>
          </View>
          <ProgressBar progress={displayEnergy / Math.max(1, gs.maxEnergy ?? 100)} colors={GRADIENTS.cyan} height={10} style={{ marginTop: 10 }} />
        </Card>

        <SectionHeader title="Quick Moves" />
        <View style={s.quickGrid}>
          <Quick icon="flash" label="Hustle" onPress={() => router.push('/tabs/hustle')} colors={GRADIENTS.gold} />
          <Quick icon="storefront" label={`Businesses (${data?.businesses?.length ?? 0})`} onPress={() => router.push('/tabs/business')} colors={GRADIENTS.green} />
          <Quick icon="business" label="City" onPress={() => router.push('/tabs/city')} colors={GRADIENTS.cyan} />
          <Quick icon="trending-up" label="Invest" onPress={() => router.push('/tabs/invest')} colors={GRADIENTS.violet} />
        </View>

        {active.length > 0 ? (
          <>
            <SectionHeader title="Active Investments" />
            {active.map((inv) => {
              const left = (new Date(inv.maturesAt).getTime() - now) / 1000;
              return (
                <Card key={inv.id} style={s.invRow}>
                  <Text style={s.invName}>{INVESTMENT_MAP[inv.opportunityKey]?.name ?? inv.opportunityKey}</Text>
                  <Text style={[s.cardHint, left <= 0 && { color: COLORS.green }]}>{left > 0 ? formatTime(left) : 'Ready!'} · {formatCash(inv.amount)}</Text>
                </Card>
              );
            })}
          </>
        ) : null}
        <View style={{ height: SPACING.xl }} />
      </ScrollView>
    </ScreenBackground>
  );
}

function Stat({ icon, label, value, color }: { icon: IconName; label: string; value: string; color: string }) {
  return (
    <View style={s.stat}>
      <View style={[s.statIcon, { backgroundColor: `${color}22` }]}><Ionicons name={icon} size={16} color={color} /></View>
      <Text style={s.statValue} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  );
}

function Quick({ icon, label, onPress, colors }: { icon: IconName; label: string; onPress: () => void; colors: readonly [string, string] }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.quick, pressed && { transform: [{ scale: 0.96 }] }]} accessibilityRole="button" accessibilityLabel={label}>
      <LinearGradient colors={colors} style={s.quickIcon}><Ionicons name={icon} size={20} color="#fff" /></LinearGradient>
      <Text style={s.quickLabel} numberOfLines={1}>{label}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.md },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1, marginRight: 8 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.cardElevated, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.cardBorder },
  avatarGold: { borderColor: COLORS.gold, borderWidth: 3 },
  avatarEmoji: { fontSize: 24 },
  name: { color: COLORS.white, fontSize: 18, fontWeight: '800' },
  rank: { color: COLORS.gold, fontSize: 12, fontWeight: '700', marginTop: 2 },
  heroLabel: { color: COLORS.textSecondary, fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  cash: { color: COLORS.gold, fontSize: 44, fontWeight: '900', letterSpacing: -1 },
  heroRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  incomeChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(34,197,94,0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full },
  incomeText: { color: COLORS.green, fontWeight: '800', fontSize: 13 },
  netWorth: { color: COLORS.white, fontSize: 13, fontWeight: '700' },
  mt: { marginTop: SPACING.md },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardLabel: { color: COLORS.textSecondary, fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  cardHint: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '700' },
  rankNow: { color: COLORS.white, fontSize: 16, fontWeight: '800' },
  rankNext: { color: COLORS.textMuted, fontSize: 12, fontWeight: '700' },
  dailyBanner: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, borderRadius: RADIUS.lg },
  dailyTitle: { color: '#1A1305', fontSize: 16, fontWeight: '900' },
  dailySub: { color: '#3B2A06', fontSize: 12, fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10 },
  stat: { width: '31.5%', backgroundColor: COLORS.card, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.cardBorder, padding: 10 },
  statIcon: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statValue: { color: COLORS.white, fontSize: 15, fontWeight: '800' },
  statLabel: { color: COLORS.textMuted, fontSize: 11, fontWeight: '600', marginTop: 2 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10 },
  quick: { width: '48.5%', flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.cardBorder, borderRadius: RADIUS.md, padding: 10, minHeight: 56 },
  quickIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  quickLabel: { color: COLORS.white, fontWeight: '700', fontSize: 14, flexShrink: 1 },
  invRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, paddingVertical: 12 },
  invName: { color: COLORS.white, fontWeight: '700' },
});
