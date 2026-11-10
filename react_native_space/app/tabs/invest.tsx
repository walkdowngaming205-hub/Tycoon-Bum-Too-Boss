import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGame } from '@/src/contexts/GameContext';
import { gameControllerCollectInvestment, gameControllerInvest, gameControllerResearch } from '@/src/api/generated/api';
import type { InvestDtoOpportunityKey, ResearchDtoOpportunityKey, AdRewardDtoOpportunityKey, InvestmentDataDto } from '@/src/api/generated/schemas';
import { Badge, Card, GradientButton, LoadingState, ScreenBackground, ScreenTitle, SectionHeader, StatPill } from '@/src/components/ui';
import { INVESTMENTS, INVESTMENT_MAP, MAX_ACTIVE_INVESTMENTS, RISK_COLORS, SENTIMENT_META, formatCash, formatTime, type InvestmentDef } from '@/src/constants/game';
import { COLORS, RADIUS, SPACING } from '@/src/constants/theme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];
const PRESETS = [0.1, 0.25, 0.5];

export default function InvestScreen() {
  const { data, gs, loading, loadError, refresh, act, busyKey, displayCash, watchAd } = useGame();
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);

  const investments = data?.investments ?? [];
  const active = useMemo(() => investments.filter((i) => i?.status === 'active'), [investments]);
  const history = useMemo(() => investments.filter((i) => i?.status !== 'active').slice(0, 10), [investments]);
  const research = useMemo(() => {
    const m: Record<string, string> = {};
    (data?.research ?? []).forEach((r) => { if (r?.opportunityKey) m[r.opportunityKey] = r?.sentiment ?? 'neutral'; });
    return m;
  }, [data?.research]);

  if (!gs) return <ScreenBackground><LoadingState error={loading ? null : loadError} onRetry={refresh} /></ScreenBackground>;

  const full = (active?.length ?? 0) >= MAX_ACTIVE_INVESTMENTS;

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <ScreenTitle title="Invest" subtitle="Research the market. Time your moves." right={<StatPill icon="cash" value={formatCash(displayCash)} />} />

        <View style={s.statsRow}>
          <Card style={s.statCard}><Text style={s.statLabel}>Returns</Text><Text style={[s.statValue, { color: (gs.investmentReturns ?? 0) >= 0 ? COLORS.green : COLORS.red }]}>{formatCash(gs.investmentReturns ?? 0)}</Text></Card>
          <Card style={s.statCard}><Text style={s.statLabel}>Win rate</Text><Text style={s.statValue}>{Math.round(gs.investmentWinRate ?? 0)}%</Text></Card>
          <Card style={s.statCard}><Text style={s.statLabel}>Active</Text><Text style={s.statValue}>{active.length}/{MAX_ACTIVE_INVESTMENTS}</Text></Card>
        </View>

        {active.length > 0 ? <SectionHeader title="Active positions" /> : null}
        {active.map((inv) => <ActiveRow key={inv.id} inv={inv} now={now} busy={busyKey === `collect-${inv.id}`}
          onCollect={() => act(`collect-${inv.id}`, () => gameControllerCollectInvestment({ investmentId: inv.id }))} />)}

        <SectionHeader title="Opportunities" subtitle={`Research costs ${formatCash(gs.researchCost ?? 0, 0)} or one ad`} />
        {INVESTMENTS.map((def) => (
          <OpportunityCard key={def.key} def={def} level={gs.level ?? 1} cash={displayCash} sentiment={research[def.key]} full={full}
            researchCost={gs.researchCost ?? 0} busyKey={busyKey}
            onResearch={() => act(`research-${def.key}`, () => gameControllerResearch({ opportunityKey: def.key as ResearchDtoOpportunityKey }))}
            onResearchAd={() => watchAd('free_research', { opportunityKey: def.key as AdRewardDtoOpportunityKey })}
            onInvest={(amount) => act(`invest-${def.key}`, () => gameControllerInvest({ opportunityKey: def.key as InvestDtoOpportunityKey, amount }))} />
        ))}

        {history.length > 0 ? <SectionHeader title="Recent results" /> : null}
        {history.map((inv) => {
          const def = INVESTMENT_MAP[inv?.opportunityKey ?? ''];
          const won = inv?.status === 'won';
          const profit = (inv?.payout ?? 0) - (inv?.amount ?? 0);
          return (
            <View key={inv.id} style={s.histRow}>
              <Ionicons name={won ? 'checkmark-circle' : 'close-circle'} size={22} color={won ? COLORS.green : COLORS.red} />
              <View style={{ flex: 1 }}>
                <Text style={s.histName}>{def?.name ?? inv?.opportunityKey}</Text>
                <Text style={s.muted}>{formatCash(inv?.amount ?? 0, 0)} → {formatCash(inv?.payout ?? 0, 0)} · ×{(inv?.multiplier ?? 0).toFixed(2)}</Text>
              </View>
              <Text style={[s.histProfit, { color: profit >= 0 ? COLORS.green : COLORS.red }]}>{profit >= 0 ? '+' : ''}{formatCash(profit, 0)}</Text>
            </View>
          );
        })}
        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenBackground>
  );
}

const ActiveRow = React.memo(function ActiveRow({ inv, now, busy, onCollect }: { inv: InvestmentDataDto; now: number; busy: boolean; onCollect: () => void }) {
  const def = INVESTMENT_MAP[inv?.opportunityKey ?? ''];
  const ends = new Date(inv?.maturesAt ?? 0).getTime();
  const left = Math.max(0, Math.ceil((ends - now) / 1000));
  const ready = left <= 0;
  return (
    <Card style={s.activeCard} accent={ready ? COLORS.green : COLORS.gold}>
      <View style={[s.iconWrap, { backgroundColor: `${RISK_COLORS[def?.risk ?? 'low']}22` }]}>
        <Ionicons name={(def?.icon ?? 'trending-up') as IconName} size={22} color={RISK_COLORS[def?.risk ?? 'low']} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.name}>{def?.name ?? inv?.opportunityKey}</Text>
        <Text style={s.muted}>Stake {formatCash(inv?.amount ?? 0, 0)}{inv?.sentiment ? ` · ${SENTIMENT_META[inv.sentiment]?.label ?? ''}` : ''}</Text>
      </View>
      {ready ? <GradientButton small title="Collect" variant="green" icon="cash" loading={busy} onPress={onCollect} />
        : <View style={s.timer}><Ionicons name="time" size={14} color={COLORS.gold} /><Text style={s.timerText}>{formatTime(left)}</Text></View>}
    </Card>
  );
});

interface OppProps {
  def: InvestmentDef; level: number; cash: number; sentiment?: string; full: boolean; researchCost: number; busyKey: string | null;
  onResearch: () => void; onResearchAd: () => void; onInvest: (amount: number) => void;
}

const OpportunityCard = React.memo(function OpportunityCard({ def, level, cash, sentiment, full, researchCost, busyKey, onResearch, onResearchAd, onInvest }: OppProps) {
  const locked = level < def.minLevel;
  const riskColor = RISK_COLORS[def.risk];
  const sm = sentiment ? SENTIMENT_META[sentiment] : null;
  return (
    <Card style={[s.oppCard, locked && { opacity: 0.55 }]} accent={riskColor}>
      <View style={s.oppHead}>
        <View style={[s.iconWrap, { backgroundColor: `${riskColor}22` }]}><Ionicons name={def.icon as IconName} size={24} color={riskColor} /></View>
        <View style={{ flex: 1 }}>
          <Text style={s.name}>{def.name}</Text>
          <Text style={s.muted}>{def.blurb}</Text>
        </View>
        <Badge text={def.risk.toUpperCase()} color={riskColor} />
      </View>
      <View style={s.metaRow}>
        <Meta icon="time-outline" text={`${def.durationMin} min`} />
        <Meta icon="swap-vertical" text={`×${def.minMult}–×${def.maxMult}`} />
        <Meta icon="pie-chart-outline" text={`~${Math.round(def.winRate * 100)}% win`} />
      </View>
      {locked ? (
        <View style={s.lockRow}><Ionicons name="lock-closed" size={14} color={COLORS.textMuted} /><Text style={s.muted}>Unlocks at level {def.minLevel}</Text></View>
      ) : (
        <>
          {sm ? (
            <View style={[s.sentiment, { borderColor: `${sm.color}66`, backgroundColor: `${sm.color}18` }]}>
              <Ionicons name={sm.icon as IconName} size={16} color={sm.color} />
              <Text style={[s.sentimentText, { color: sm.color }]}>Analyst says: {sm.label}</Text>
            </View>
          ) : (
            <View style={s.btnRow}>
              <GradientButton small title={`Research ${formatCash(researchCost, 0)}`} icon="search" variant="cyan" disabled={cash < researchCost}
                loading={busyKey === `research-${def.key}`} onPress={onResearch} style={{ flex: 1 }} />
              <GradientButton small title="Free (Ad)" icon="play-circle" variant="violet" onPress={onResearchAd} style={{ flex: 1 }} />
            </View>
          )}
          <View style={s.btnRow}>
            {PRESETS.map((p) => {
              const amt = Math.floor(cash * p);
              const disabled = full || amt < 10 || busyKey === `invest-${def.key}`;
              return (
                <Pressable key={p} disabled={disabled} onPress={() => onInvest(amt)} accessibilityRole="button" accessibilityLabel={`Invest ${Math.round(p * 100)} percent`}
                  style={({ pressed }) => [s.preset, disabled && { opacity: 0.4 }, pressed && { transform: [{ scale: 0.97 }] }]}>
                  <Text style={s.presetPct}>{Math.round(p * 100)}%</Text>
                  <Text style={s.presetAmt}>{formatCash(amt, 0)}</Text>
                </Pressable>
              );
            })}
          </View>
          {full ? <Text style={[s.muted, { marginTop: 6 }]}>Max {MAX_ACTIVE_INVESTMENTS} active positions — collect one first.</Text> : null}
        </>
      )}
    </Card>
  );
});

function Meta({ icon, text }: { icon: IconName; text: string }) {
  return <View style={s.meta}><Ionicons name={icon} size={13} color={COLORS.textSecondary} /><Text style={s.metaText}>{text}</Text></View>;
}

const s = StyleSheet.create({
  content: { padding: SPACING.md, paddingBottom: 40 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: SPACING.sm },
  statCard: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  statLabel: { color: COLORS.textMuted, fontSize: 12, marginBottom: 4 },
  statValue: { color: COLORS.white, fontSize: 16, fontWeight: '800' },
  activeCard: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  iconWrap: { width: 44, height: 44, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center' },
  name: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  muted: { color: COLORS.textMuted, fontSize: 12.5, marginTop: 2 },
  timer: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: RADIUS.full, backgroundColor: 'rgba(245,197,66,0.12)' },
  timerText: { color: COLORS.gold, fontWeight: '700', fontVariant: ['tabular-nums'] },
  oppCard: { marginBottom: 12 },
  oppHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 12 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { color: COLORS.textSecondary, fontSize: 12.5 },
  lockRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
  sentiment: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: RADIUS.md, padding: 10, marginTop: 12 },
  sentimentText: { fontWeight: '700', fontSize: 13.5 },
  btnRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  preset: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: RADIUS.md, backgroundColor: 'rgba(245,197,66,0.1)', borderWidth: 1, borderColor: 'rgba(245,197,66,0.35)', minHeight: 48 },
  presetPct: { color: COLORS.gold, fontWeight: '800', fontSize: 15 },
  presetAmt: { color: COLORS.textSecondary, fontSize: 12, marginTop: 2 },
  histRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: COLORS.cardBorder },
  histName: { color: COLORS.white, fontWeight: '600', fontSize: 14.5 },
  histProfit: { fontWeight: '800', fontSize: 14 },
});
