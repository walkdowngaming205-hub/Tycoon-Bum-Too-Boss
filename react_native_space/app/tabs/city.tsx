import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGame } from '@/src/contexts/GameContext';
import { gameControllerBuyProperty, gameControllerBuyVehicle, gameControllerRepayLoan, gameControllerTakeLoan } from '@/src/api/generated/api';
import type { BuyPropertyDtoPropertyKey, BuyVehicleDtoVehicleKey } from '@/src/api/generated/schemas';
import { Badge, Card, GradientButton, ImageHero, LoadingState, ProgressBar, ScreenBackground, ScreenTitle, SectionHeader, StatPill } from '@/src/components/ui';
import { DISTRICTS, DISTRICT_MAP, IMAGES, PROPERTIES, VEHICLES, formatCash } from '@/src/constants/game';
import { COLORS, GRADIENTS, RADIUS, SPACING } from '@/src/constants/theme';

type Tab = 'districts' | 'property' | 'vehicles' | 'bank';
const TABS: { key: Tab; label: string; icon: React.ComponentProps<typeof Ionicons>['name'] }[] = [
  { key: 'districts', label: 'Districts', icon: 'map' },
  { key: 'property', label: 'Property', icon: 'home' },
  { key: 'vehicles', label: 'Garage', icon: 'car-sport' },
  { key: 'bank', label: 'Bank', icon: 'card' },
];

export default function CityScreen() {
  const { gs, loading, loadError, refresh, act, busyKey, displayCash } = useGame();
  const [tab, setTab] = useState<Tab>('districts');
  if (!gs) return <ScreenBackground><LoadingState error={loading ? null : loadError} onRetry={refresh} /></ScreenBackground>;

  const unlocked = gs.unlockedDistricts ?? [];
  const ownedProps = gs.properties ?? [];
  const ownedVeh = gs.vehicles ?? [];

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={s.content} stickyHeaderIndices={[1]}>
        <ScreenTitle title="The City" subtitle={`${unlocked.length}/${DISTRICTS.length} districts unlocked`} right={<StatPill icon="cash" value={formatCash(displayCash)} />} />
        <View style={s.segmentWrap}>
          <View style={s.segment}>
            {TABS.map((t) => (
              <Pressable key={t.key} onPress={() => setTab(t.key)} style={[s.segBtn, tab === t.key && s.segActive]} accessibilityRole="tab" accessibilityState={{ selected: tab === t.key }}>
                <Ionicons name={t.icon} size={15} color={tab === t.key ? '#1A1305' : COLORS.textSecondary} />
                <Text style={[s.segText, tab === t.key && { color: '#1A1305' }]}>{t.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {tab === 'districts' && DISTRICTS.map((d) => {
          const open = unlocked.includes(d.key);
          const nwP = d.minNetWorth > 0 ? (gs.netWorth ?? 0) / d.minNetWorth : 1;
          const repP = d.minReputation > 0 ? (gs.reputation ?? 0) / d.minReputation : 1;
          return (
            <ImageHero key={d.key} source={IMAGES[d.image]} height={160} dim={!open} style={s.mb}>
              <View style={s.rowBetween}>
                <View style={{ flex: 1 }}>
                  <Badge text={open ? 'Unlocked' : 'Locked'} color={open ? COLORS.green : COLORS.orange} icon={open ? 'checkmark-circle' : 'lock-closed'} />
                  <Text style={s.title}>{d.name}</Text>
                  <Text style={s.sub}>{d.tagline}</Text>
                </View>
              </View>
              {!open ? (
                <View style={{ marginTop: 10, gap: 6 }}>
                  <Req label={`Net worth ${formatCash(gs.netWorth, 1)} / ${formatCash(d.minNetWorth, 0)}`} p={nwP} />
                  <Req label={`Reputation ${gs.reputation ?? 0} / ${d.minReputation}`} p={repP} />
                </View>
              ) : null}
            </ImageHero>
          );
        })}

        {tab === 'property' && (
          <>
            <Text style={s.intro}>Properties pay rent every second — and count toward net worth.</Text>
            {PROPERTIES.map((p) => {
              const owned = ownedProps.includes(p.key);
              const open = unlocked.includes(p.district);
              return (
                <AssetCard key={p.key} image={p.image} name={p.name} district={DISTRICT_MAP[p.district]?.name ?? ''} owned={owned} open={open}
                  perk={`+${formatCash(p.rent)}/s rent`} cost={p.cost} cash={displayCash} busy={busyKey === `prop-${p.key}`}
                  onBuy={() => act(`prop-${p.key}`, () => gameControllerBuyProperty({ propertyKey: p.key as BuyPropertyDtoPropertyKey }))} />
              );
            })}
          </>
        )}

        {tab === 'vehicles' && (
          <>
            <Text style={s.intro}>Rides boost business income and hustle payouts permanently.</Text>
            {VEHICLES.map((v) => {
              const owned = ownedVeh.includes(v.key);
              const open = unlocked.includes(v.district);
              return (
                <AssetCard key={v.key} image={v.image} name={v.name} district={DISTRICT_MAP[v.district]?.name ?? ''} owned={owned} open={open}
                  perk={`+${Math.round(v.incomeBonus * 100)}% income · +${Math.round(v.hustleBonus * 100)}% hustle`} cost={v.cost} cash={displayCash} busy={busyKey === `veh-${v.key}`}
                  onBuy={() => act(`veh-${v.key}`, () => gameControllerBuyVehicle({ vehicleKey: v.key as BuyVehicleDtoVehicleKey }))} />
              );
            })}
          </>
        )}

        {tab === 'bank' && <Bank />}
        <View style={{ height: SPACING.xl }} />
      </ScrollView>
    </ScreenBackground>
  );
}

function Req({ label, p }: { label: string; p: number }) {
  return (
    <View>
      <Text style={s.reqText}>{label}</Text>
      <ProgressBar progress={p} height={5} colors={p >= 1 ? GRADIENTS.green : GRADIENTS.gold} style={{ marginTop: 3 }} />
    </View>
  );
}

function AssetCard({ image, name, district, owned, open, perk, cost, cash, busy, onBuy }: { image: string; name: string; district: string; owned: boolean; open: boolean; perk: string; cost: number; cash: number; busy: boolean; onBuy: () => void }) {
  return (
    <View style={[s.asset, owned && { borderColor: 'rgba(34,197,94,0.4)' }]}>
      <Image source={IMAGES[image]} style={[s.assetImg, !open && { opacity: 0.35 }]} resizeMode="cover" />
      <View style={s.assetBody}>
        <Text style={s.assetName} numberOfLines={1}>{name}</Text>
        <Text style={s.assetDistrict}>{district}</Text>
        <Text style={s.assetPerk}>{perk}</Text>
        <View style={{ marginTop: 8 }}>
          {owned ? (
            <Badge text="Owned" color={COLORS.green} icon="checkmark-circle" />
          ) : !open ? (
            <Badge text={`Unlock ${district}`} color={COLORS.orange} icon="lock-closed" />
          ) : (
            <GradientButton small title={formatCash(cost, 1)} icon="cart" variant="green" disabled={cash < cost} loading={busy} onPress={onBuy} />
          )}
        </View>
      </View>
    </View>
  );
}

function Bank() {
  const { gs, act, busyKey, displayCash } = useGame();
  if (!gs) return null;
  const debt = gs.debt ?? 0;
  const limit = gs.creditLimit ?? 0;
  const room = Math.max(0, (limit - debt) / 1.15);
  const loanOptions = [0.25, 0.5, 1].map((f) => Math.floor(room * f)).filter((v, i, a) => v >= 10 && a.indexOf(v) === i);
  const repayOptions = [0.25, 0.5, 1].map((f) => Math.min(displayCash, debt * f)).map((v) => Math.floor(v * 100) / 100).filter((v, i, a) => v > 0 && a.indexOf(v) === i);
  return (
    <>
      <Card accent="rgba(245,197,66,0.3)" style={s.mb}>
        <View style={s.rowBetween}>
          <View>
            <Text style={s.label}>OUTSTANDING DEBT</Text>
            <Text style={[s.big, { color: debt > 0 ? COLORS.red : COLORS.green }]}>{formatCash(debt)}</Text>
          </View>
          <Ionicons name="business" size={36} color={COLORS.gold} />
        </View>
        <Text style={[s.label, { marginTop: 12 }]}>CREDIT USED</Text>
        <ProgressBar progress={limit > 0 ? debt / limit : 0} colors={GRADIENTS.red} height={8} style={{ marginTop: 6 }} />
        <Text style={s.hint}>Credit limit {formatCash(limit)} · grows with level & net worth · 15% loan fee</Text>
      </Card>

      <SectionHeader title="Take a Loan" subtitle="Fuel expansion now, repay later" />
      {loanOptions.length === 0 ? <Text style={s.intro}>No credit available right now.</Text> : (
        <View style={s.btnRow}>
          {loanOptions.map((amt) => (
            <GradientButton key={amt} small variant="gold" title={formatCash(amt, 1)} icon="add-circle" style={{ flex: 1 }} loading={busyKey === `loan-${amt}`}
              onPress={() => act(`loan-${amt}`, () => gameControllerTakeLoan({ amount: amt }))} />
          ))}
        </View>
      )}

      {debt > 0 ? (
        <>
          <SectionHeader title="Repay" subtitle="Clear debt to protect your empire" />
          <View style={s.btnRow}>
            {repayOptions.map((amt) => (
              <GradientButton key={amt} small variant="green" title={formatCash(amt, 1)} icon="checkmark-circle" style={{ flex: 1 }} loading={busyKey === `repay-${amt}`}
                onPress={() => act(`repay-${amt}`, () => gameControllerRepayLoan({ amount: amt }))} />
            ))}
          </View>
        </>
      ) : null}
    </>
  );
}

const s = StyleSheet.create({
  content: { padding: SPACING.md },
  mb: { marginBottom: SPACING.md },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  segmentWrap: { paddingBottom: SPACING.md, backgroundColor: 'transparent' },
  segment: { flexDirection: 'row', backgroundColor: 'rgba(20,20,38,0.96)', borderRadius: RADIUS.md, padding: 4, borderWidth: 1, borderColor: COLORS.cardBorder },
  segBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 10, borderRadius: RADIUS.sm, minHeight: 40 },
  segActive: { backgroundColor: COLORS.gold },
  segText: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '800' },
  title: { color: COLORS.white, fontSize: 22, fontWeight: '900', marginTop: 6 },
  sub: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '600' },
  reqText: { color: COLORS.white, fontSize: 12, fontWeight: '700' },
  intro: { color: COLORS.textSecondary, fontSize: 13, marginBottom: SPACING.md },
  asset: { flexDirection: 'row', backgroundColor: COLORS.card, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.cardBorder, overflow: 'hidden', marginBottom: SPACING.md },
  assetImg: { width: 120, minHeight: 130, height: '100%' },
  assetBody: { flex: 1, padding: 12 },
  assetName: { color: COLORS.white, fontSize: 17, fontWeight: '900' },
  assetDistrict: { color: COLORS.cyan, fontSize: 11, fontWeight: '800', marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
  assetPerk: { color: COLORS.green, fontSize: 13, fontWeight: '700', marginTop: 6 },
  label: { color: COLORS.textSecondary, fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  big: { fontSize: 30, fontWeight: '900', marginTop: 4 },
  hint: { color: COLORS.textMuted, fontSize: 12, marginTop: 8 },
  btnRow: { flexDirection: 'row', gap: 8 },
});
