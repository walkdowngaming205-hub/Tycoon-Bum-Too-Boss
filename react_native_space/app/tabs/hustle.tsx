
import React, { useCallback, useEffect, useState } from 'react';
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useGame } from '@/src/contexts/GameContext';
import { gameControllerHustle } from '@/src/api/generated/api';
import type { HustleDtoHustleType } from '@/src/api/generated/schemas';

import {
  ScreenBackground,
  LoadingState,
} from '@/src/components/ui';

import {
  HUSTLES,
  IMAGES,
  formatCash,
  type HustleDef,
} from '@/src/constants/game';

import {
  COLORS,
  GRADIENTS,
  RADIUS,
  SPACING,
} from '@/src/constants/theme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export default function HustleScreen() {
  const {
    gs,
    loading,
    loadError,
    refresh,
    act,
    busyKey,
    displayCash,
    watchAd,
  } = useGame();

  const [now, setNow] = useState(Date.now());

  // Update the boost countdown once per second.
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!gs) {
    return (
      <ScreenBackground>
        <LoadingState
          error={loading ? null : loadError}
          onRetry={refresh}
        />
      </ScreenBackground>
    );
  }

  // Automatically select the highest hustle unlocked by the player.
  const activeHustle =
    [...HUSTLES]
      .reverse()
      .find((h) => (gs.level ?? 1) >= h.unlockLevel) ??
    HUSTLES[0];

  const reputationMultiplier =
    1 + (gs.reputation ?? 0) / 100;

  const vehicleMultiplier =
    1 + (gs.hustleBonus ?? 0);

  const boostUntil = gs.tapBoostUntil
    ? new Date(gs.tapBoostUntil).getTime()
    : 0;

  const boostRemaining = Math.max(
    0,
    Math.ceil((boostUntil - now) / 1000),
  );

  const boostActive = boostRemaining > 0;

  const totalMultiplier =
    reputationMultiplier *
    vehicleMultiplier *
    (boostActive ? 2 : 1);

  const payout =
    activeHustle.reward *
    reputationMultiplier *
    vehicleMultiplier *
    (boostActive ? 2 : 1);

  const busy = busyKey === `hustle-${activeHustle.key}`;

  const xpProgress = Math.min(
    1,
    Math.max(0, (gs.xp ?? 0) / Math.max(1, gs.xpToNext ?? 1)),
  );

  const doHustle = useCallback(() => {
    if (!activeHustle || busy) return;

    act(`hustle-${activeHustle.key}`, () =>
      gameControllerHustle({
        hustleType: activeHustle.key as HustleDtoHustleType,
      }),
    );
  }, [activeHustle, busy, act]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(
      remainingSeconds,
    ).padStart(2, '0')}`;
  };

  // Temporary background mapping.
  // We'll create dedicated artwork for every hustle after the screen works.
  const background =
    activeHustle.key === 'wash_cars'
      ? IMAGES.biz_car_wash
      : activeHustle.key === 'food_stand'
        ? IMAGES.biz_food_truck
        : IMAGES.district_block;

  return (
    <ScreenBackground>
      <View style={s.container}>
        <ImageBackground
          source={background}
          style={s.background}
          imageStyle={s.backgroundImage}
          resizeMode="cover"
        >
          <LinearGradient
            colors={[
              'rgba(5,5,15,0.88)',
              'rgba(5,5,15,0.25)',
              'rgba(5,5,15,0.35)',
              'rgba(5,5,15,0.94)',
            ]}
            locations={[0, 0.35, 0.65, 1]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />

          {/* Full-screen tapping surface */}
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={doHustle}
            disabled={busy}
            accessibilityRole="button"
            accessibilityLabel={`Tap to ${activeHustle.name}`}
          />

          {/* Top HUD */}
          <View style={s.topHud} pointerEvents="none">
            <View style={s.topRow}>
              <View>
                <Text style={s.eyebrow}>YOUR HUSTLE</Text>
                <Text style={s.screenTitle}>THE GRIND</Text>
              </View>

              <View style={s.cashPill}>
                <Ionicons
                  name="wallet"
                  size={17}
                  color={COLORS.gold}
                />
                <Text style={s.cashText}>
                  {formatCash(displayCash)}
                </Text>
              </View>
            </View>

            <View style={s.levelRow}>
              <View style={s.levelBadge}>
                <Text style={s.levelNumber}>
                  {gs.level}
                </Text>
              </View>

              <View style={s.xpContainer}>
                <View style={s.xpLabels}>
                  <Text style={s.xpLabel}>LEVEL {gs.level}</Text>
                  <Text style={s.xpLabel}>
                    {gs.xp} / {gs.xpToNext} XP
                  </Text>
                </View>

                <View style={s.xpTrack}>
                  <View
                    style={[
                      s.xpFill,
                      { width: `${xpProgress * 100}%` },
                    ]}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Active hustle information */}
          <View style={s.hustleInfo} pointerEvents="none">
            <View style={s.hustleTag}>
              <Ionicons
                name={activeHustle.icon as IconName}
                size={15}
                color={COLORS.gold}
              />
              <Text style={s.hustleTagText}>
                CURRENT HUSTLE
              </Text>
            </View>

            <Text style={s.hustleName}>
              {activeHustle.name}
            </Text>

            <Text style={s.hustleDescription}>
              Keep tapping. Build your money. Level up.
            </Text>
          </View>

          {/* Main tap target */}
          <View style={s.tapPrompt} pointerEvents="none">
            <View
              style={[
                s.tapCircle,
                boostActive && s.tapCircleBoosted,
                busy && { opacity: 0.65 },
              ]}
            >
              <LinearGradient
                colors={
                  boostActive
                    ? ['#F6D365', '#FCA311']
                    : GRADIENTS.gold
                }
                style={s.tapCircleInner}
              >
                <Ionicons
                  name={busy ? 'hourglass' : 'hand-left'}
                  size={42}
                  color="#211805"
                />

                <Text style={s.tapText}>
                  {busy ? 'WORKING...' : 'TAP'}
                </Text>
              </LinearGradient>
            </View>

            <Text style={s.tapHint}>
              TAP ANYWHERE TO EARN
            </Text>

            <Text style={s.payoutText}>
              +{formatCash(payout)}
            </Text>

            <Text style={s.perTapText}>
              PER SUCCESSFUL HUSTLE
            </Text>
          </View>

          {/* Bottom HUD */}
          <View style={s.bottomHud}>
            <View style={s.multiplierRow}>
              <View style={s.multiplierItem}>
                <Ionicons
                  name="shield-checkmark"
                  size={16}
                  color={COLORS.violet}
                />
                <Text style={s.multiplierLabel}>
                  REP +{gs.reputation ?? 0}%
                </Text>
              </View>

              <View style={s.multiplierItem}>
                <Ionicons
                  name="car-sport"
                  size={16}
                  color={COLORS.cyan}
                />
                <Text style={s.multiplierLabel}>
                  VEHICLE +{Math.round(
                    (gs.hustleBonus ?? 0) * 100,
                  )}%
                </Text>
              </View>

              <View style={s.multiplierItem}>
                <Ionicons
                  name="trending-up"
                  size={16}
                  color={COLORS.gold}
                />
                <Text style={s.multiplierLabel}>
                  TOTAL ×{totalMultiplier.toFixed(2)}
                </Text>
              </View>
            </View>

            <Pressable
              style={[
                s.boostButton,
                boostActive && s.boostButtonActive,
              ]}
              disabled={boostActive}
              onPress={() => watchAd('tap_boost')}
            >
              <LinearGradient
                colors={
                  boostActive
                    ? ['#725A20', '#4B3B16']
                    : GRADIENTS.violet
                }
                style={s.boostGradient}
              >
                <Ionicons
                  name={boostActive ? 'timer' : 'play-circle'}
                  size={23}
                  color="#FFFFFF"
                />

                <View style={s.boostTextContainer}>
                  <Text style={s.boostTitle}>
                    {boostActive
                      ? '2X BOOST ACTIVE'
                      : 'WATCH AD FOR 2X'}
                  </Text>

                  <Text style={s.boostSubtitle}>
                    {boostActive
                      ? `${formatTime(boostRemaining)} REMAINING`
                      : 'DOUBLE CASH + REP FOR 5 MIN'}
                  </Text>
                </View>

                {!boostActive && (
                  <Ionicons
                    name="chevron-forward"
                    size={21}
                    color="#FFFFFF"
                  />
                )}
              </LinearGradient>
            </Pressable>

            <Text style={s.footerText}>
              {activeHustle.xp} XP PER SUCCESSFUL HUSTLE
            </Text>
          </View>
        </ImageBackground>
      </View>
    </ScreenBackground>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: -SPACING.md,
    marginTop: -SPACING.md,
    marginBottom: -SPACING.md,
  },

  background: {
    flex: 1,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },

  backgroundImage: {
    opacity: 0.95,
  },

  topHud: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  eyebrow: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },

  screenTitle: {
    color: COLORS.white,
    fontSize: 27,
    fontWeight: '900',
    letterSpacing: 1,
  },

  cashPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(15,15,25,0.85)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: RADIUS.full,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },

  cashText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '900',
  },

  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 20,
  },

  levelBadge: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },

  levelNumber: {
    color: '#211805',
    fontSize: 21,
    fontWeight: '900',
  },

  xpContainer: {
    flex: 1,
  },

  xpLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 7,
  },

  xpLabel: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '800',
  },

  xpTrack: {
    height: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },

  xpFill: {
    height: '100%',
    backgroundColor: COLORS.gold,
    borderRadius: 8,
  },

  hustleInfo: {
    alignItems: 'center',
    marginTop: 12,
  },

  hustleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(10,10,20,0.8)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },

  hustleTagText: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  hustleName: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 9,
    textShadowColor: '#000000',
    textShadowRadius: 12,
  },

  hustleDescription: {
    color: '#E0E0E0',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 5,
    textAlign: 'center',
  },

  tapPrompt: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },

  tapCircle: {
    width: 158,
    height: 158,
    borderRadius: 79,
    padding: 7,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.65)',
  },

  tapCircleBoosted: {
    borderColor: COLORS.gold,
    borderWidth: 4,
  },

  tapCircleInner: {
    flex: 1,
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  tapText: {
    color: '#211805',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 2,
  },

  tapHint: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 14,
  },

  payoutText: {
    color: COLORS.gold,
    fontSize: 28,
    fontWeight: '900',
    marginTop: 5,
  },

  perTapText: {
    color: '#D8D8D8',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
  },

  bottomHud: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.lg,
    gap: 12,
  },

  multiplierRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(10,10,20,0.88)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: RADIUS.lg,
    paddingVertical: 13,
    paddingHorizontal: 9,
  },

  multiplierItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  multiplierLabel: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: '900',
  },

  boostButton: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.violet,
  },

  boostButtonActive: {
    borderColor: COLORS.gold,
  },

  boostGradient: {
    minHeight: 65,
    paddingHorizontal: 16,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  boostTextContainer: {
    flex: 1,
  },

  boostTitle: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  boostSubtitle: {
    color: '#E2D9FF',
    fontSize: 10,
    fontWeight: '800',
    marginTop: 4,
  },

  footerText: {
    color: '#D0D0D0',
    fontSize: 9,
    textAlign: 'center',
    fontWeight: '800',
    letterSpacing: 1.3,
  },
});
