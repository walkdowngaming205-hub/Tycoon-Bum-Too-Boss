import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGame } from '@/src/contexts/GameContext';
import { gameControllerBuyBusiness, gameControllerHire, gameControllerUpgradeBusiness } from '@/src/api/generated/api';
import type { BusinessDataDto, BuyBusinessDtoBusinessType } from '@/src/api/generated/schemas';
import { Badge, Card, GradientButton, ImageHero, LoadingState, ScreenBackground, ScreenTitle, SectionHeader, StatPill } from '@/src/components/ui';
import { BUSINESSES, BUSINESS_MAP, DISTRICT_MAP, IMAGES, MAX_BUSINESS_LEVEL, MAX_EMPLOYEES, formatCash, formatTime } from '@/src/constants/game';
import { COLORS, SPACING } from '@/src/constants/theme';

export default function BusinessScreen() {
  const { data, gs, loading, loadError, refresh, act, busyKey, displayCash, watchAd } = useGame();
  if (!gs) return <ScreenBackground><LoadingState error={loading ? null : loadError} onRetry={refresh} /></ScreenBackground>;

  const owned = data?.businesses ?? [];
  const ownedTypes = new Set(owned.map((b) => b.businessType));
  const available = BUSINESSES.filter((b) => !ownedTypes.has(b.key));
  const unlocked = gs.unlockedDistricts ?? [];

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={s.content}>
        <ScreenTitle
          title="Businesses"
          subtitle={`${owned.length}/${BUSINESSES.length} owned · ${formatCash(gs.businessIncomePerSecond)}/s net`}
          right={<StatPill icon="cash" value={formatCash(displayCash)} />}
        />

        {owned.length === 0 ? (
          <Card style={s.empty}>
            <Ionicons name="storefront-outline" size={40} color={COLORS.gold} />
            <Text style={s.emptyTitle}>No businesses yet</Text>
            <Text style={s.emptyText}>Hustle up $50 and open a Lemonade Stand to start earning passive income.</Text>
          </Card>
        ) : (
          owned.map((b) => (
            <OwnedBusiness
              key={b.id}
              b={b}
              cash={displayCash}
              busyKey={busyKey}
              onUpgrade={() => act(`up-${b.id}`, () => gameControllerUpgradeBusiness({ businessId: b.id }))}
              onHire={() => act(`hire-${b.id}`, () => gameControllerHire({ businessId: b.id }))}
              onBoost={() => watchAd('business_boost', { targetBusinessId: b.id })}
            />
          ))
        )}

        {available.length > 0 ? <SectionHeader title="Open a New Business" subtitle="Unlock with level, reputation & districts" /> : null}
        {available.map((def) => {
          const district = DISTRICT_MAP[def.district];
          const reasons: string[] = [];
          if ((gs.level ?? 1) < def.unlockLevel) reasons.push(`Level ${def.unlockLevel}`);
          if ((gs.reputation ?? 0) < def.minReputation) reasons.push(`${def.minReputation} rep`);
          if (!unlocked.includes(def.district)) reasons.push(`Unlock ${district?.name ?? def.district}`);
          const locked = reasons.length > 0;
          const affordable = displayCash >= def.cost;
          return (
            <View key={def.key} style={s.buyCard}>
              <ImageHero source={IMAGES[def.image]} height={130} dim={locked}>
                <View style={s.rowBetween}>
                  <View style={{ flex: 1 }}>
                    <Badge text={district?.name ?? ''} color={COLORS.cyan} icon="location" />
                    <Text style={s.bizName}>{def.name}</Text>
                    <Text style={s.bizMeta}>Base {formatCash(def.baseIncome)}/s</Text>
                  </View>
                  {locked ? <Ionicons name="lock-closed" size={28} color={COLORS.textSecondary} /> : null}
                </View>
              </ImageHero>
              <View style={s.buyFooter}>
                <Text style={[s.lockText, !locked && { color: COLORS.textSecondary }]} numberOfLines={2}>
                  {locked ? `Requires: ${reasons.join(' · ')}` : affordable ? 'Ready to open' : `Need ${formatCash(def.cost - displayCash)} more`}
                </Text>
                <GradientButton
                  small
                  title={formatCash(def.cost, 1)}
                  icon="cart"
                  variant="green"
                  disabled={locked || !affordable}
                  loading={busyKey === `buy-${def.key}`}
                  onPress={() => act(`buy-${def.key}`, () => gameControllerBuyBusiness({ businessType: def.key as BuyBusinessDtoBusinessType }))}
                />
              </View>
            </View>
          );
        })}
        <View style={{ height: SPACING.xl }} />
      </ScrollView>
    </ScreenBackground>
  );
}

function OwnedBusiness({ b, cash, busyKey, onUpgrade, onHire, onBoost }: { b: BusinessDataDto; cash: number; busyKey: string | null; onUpgrade: () => void; onHire: () => void; onBoost: () => void }) {
  const def = BUSINESS_MAP[b.businessType];
  const boostLeft = b.incomeBoostUntil ? (new Date(b.incomeBoostUntil).getTime() - Date.now()) / 1000 : 0;
  const maxed = b.upgradeCost == null;
  const fullStaff = b.hireCost == null;
  return (
    <View style={s.ownedCard}>
      <ImageHero source={def ? IMAGES[def.image] : undefined} height={150}>
        <View style={s.rowBetween}>
          <View style={{ flex: 1 }}>
            <Text style={s.bizName} numberOfLines={1}>{b.customName || def?.name || b.businessType}</Text>
            <View style={[s.row, { marginTop: 4 }]}>
              <Badge text={`Lv ${b.level}/${MAX_BUSINESS_LEVEL}`} color={COLORS.gold} icon="star" />
              <Badge text={`${b.employees}/${MAX_EMPLOYEES} staff`} color={COLORS.cyan} icon="people" />
              {boostLeft > 0 ? <Badge text={`2× ${formatTime(boostLeft)}`} color={COLORS.violet} icon="flash" /> : null}
            </View>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={s.income}>+{formatCash(b.incomePerSecond)}/s</Text>
            <Text style={s.expense}>-{formatCash(b.expensesPerSecond)}/s costs</Text>
          </View>
        </View>
      </ImageHero>
      <View style={s.actions}>
        <GradientButton small style={s.flex} variant="gold" icon="arrow-up"
          title={maxed ? 'MAX' : formatCash(b.upgradeCost, 1)} accessibilityLabel="Upgrade business"
          disabled={maxed || cash < (b.upgradeCost ?? Infinity)} loading={busyKey === `up-${b.id}`} onPress={onUpgrade} />
        <GradientButton small style={s.flex} variant="cyan" icon="person-add"
          title={fullStaff ? 'FULL' : formatCash(b.hireCost, 1)} accessibilityLabel="Hire employee"
          disabled={fullStaff || cash < (b.hireCost ?? Infinity)} loading={busyKey === `hire-${b.id}`} onPress={onHire} />
        <GradientButton small style={s.flex} variant="violet" icon="play-circle" title="2×" accessibilityLabel="Watch ad for 2x income"
          disabled={boostLeft > 0} onPress={onBoost} />
      </View>
      <Text style={s.value}>Value {formatCash(b.value)} · Gross {formatCash(b.grossPerSecond)}/s</Text>
    </View>
  );
}

const s = StyleSheet.create({
  content: { padding: SPACING.md },
  flex: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  rowBetween: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  empty: { alignItems: 'center', paddingVertical: SPACING.lg },
  emptyTitle: { color: COLORS.white, fontSize: 18, fontWeight: '800', marginTop: 8 },
  emptyText: { color: COLORS.textSecondary, textAlign: 'center', marginTop: 6 },
  ownedCard: { backgroundColor: COLORS.card, borderRadius: 18, borderWidth: 1, borderColor: 'rgba(245,197,66,0.2)', marginBottom: SPACING.md, overflow: 'hidden' },
  bizName: { color: COLORS.white, fontSize: 19, fontWeight: '900', marginTop: 4 },
  bizMeta: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '700', marginTop: 2 },
  income: { color: COLORS.green, fontSize: 18, fontWeight: '900' },
  expense: { color: COLORS.textSecondary, fontSize: 11, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 8, paddingHorizontal: 12, paddingTop: 12 },
  value: { color: COLORS.textMuted, fontSize: 11, fontWeight: '600', padding: 12, paddingTop: 8 },
  buyCard: { backgroundColor: COLORS.card, borderRadius: 18, borderWidth: 1, borderColor: COLORS.cardBorder, marginBottom: SPACING.md, overflow: 'hidden' },
  buyFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, gap: 10 },
  lockText: { color: COLORS.orange, fontSize: 12, fontWeight: '700', flex: 1 },
});
