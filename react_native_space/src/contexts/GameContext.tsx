import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { gameControllerAdReward, gameControllerGetState } from '@/src/api/generated/api';
import type { ActionResponseDto, AdRewardDto, GameStateDataDto, GameStateResponseDto } from '@/src/api/generated/schemas';
import { getErrorMessage } from '@/src/api/customFetch';
import { ACHIEVEMENTS, formatCash } from '@/src/constants/game';

export type ToastKind = 'success' | 'error' | 'info' | 'gold';
export interface ToastItem { id: number; text: string; kind: ToastKind }
type AdRewardType = AdRewardDto['rewardType'];

interface GameContextType {
  data: GameStateResponseDto | null;
  gs: GameStateDataDto | null;
  loading: boolean;
  loadError: string | null;
  displayCash: number;
  displayEnergy: number;
  busyKey: string | null;
  toasts: ToastItem[];
  levelUp: number | null;
  adRequest: { rewardType: AdRewardType } | null;
  dailyOpen: boolean;
  refresh: () => Promise<void>;
  act: (key: string, fn: () => Promise<ActionResponseDto>, opts?: { silent?: boolean }) => Promise<ActionResponseDto | null>;
  watchAd: (rewardType: AdRewardType, extra?: Omit<AdRewardDto, 'rewardType'>) => void;
  completeAd: () => void;
  cancelAd: () => void;
  showToast: (text: string, kind?: ToastKind) => void;
  clearLevelUp: () => void;
  setDailyOpen: (v: boolean) => void;
}

const GameContext = createContext<GameContextType | null>(null);

export function haptic(kind: 'light' | 'success' | 'error' = 'light') {
  if (Platform.OS === 'web') return;
  try {
    if (kind === 'light') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    else Haptics.notificationAsync(kind === 'success' ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error);
  } catch {
    // haptics unavailable
  }
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<GameStateResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [levelUp, setLevelUp] = useState<number | null>(null);
  const [adRequest, setAdRequest] = useState<{ rewardType: AdRewardType } | null>(null);
  const [dailyOpen, setDailyOpen] = useState(false);
  const [now, setNow] = useState(Date.now());
  const fetchedAt = useRef(Date.now());
  const adExtra = useRef<Omit<AdRewardDto, 'rewardType'> | undefined>(undefined);
  const toastId = useRef(0);

  const showToast = useCallback((text: string, kind: ToastKind = 'info') => {
    const id = ++toastId.current;
    setToasts((t) => [...(t ?? []).slice(-2), { id, text, kind }]);
    setTimeout(() => setToasts((t) => (t ?? []).filter((x) => x.id !== id)), 2600);
  }, []);

  const applyState = useCallback((s: GameStateResponseDto | null | undefined) => {
    if (!s?.gameState) return;
    fetchedAt.current = Date.now();
    setData(s);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const s = await gameControllerGetState();
      applyState(s);
      setLoadError(null);
    } catch (e) {
      console.error('[Game] refresh failed', e);
      setLoadError(getErrorMessage(e, 'Could not load your empire'));
    } finally {
      setLoading(false);
    }
  }, [applyState]);

  const refreshRef = useRef(refresh);
  refreshRef.current = refresh;

  useEffect(() => {
    refreshRef.current();
    const poll = setInterval(() => refreshRef.current(), 30000);
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => { clearInterval(poll); clearInterval(tick); };
  }, []);

  const act = useCallback<GameContextType['act']>(async (key, fn, opts) => {
    setBusyKey(key);
    try {
      const res = await fn();
      applyState(res?.state);
      if (!opts?.silent && res?.message) {
        showToast(res.message, res.success ? 'success' : 'error');
      }
      haptic(res?.success ? 'light' : 'error');
      if (res?.leveledUp && res?.newLevel) setLevelUp(res.newLevel);
      (res?.achievementsUnlocked ?? []).forEach((k, i) => {
        setTimeout(() => showToast(`🏆 Achievement: ${ACHIEVEMENTS[k]?.title ?? k}`, 'gold'), 400 + i * 500);
      });
      if ((res?.bossCoinsAwarded ?? 0) > 0) setTimeout(() => showToast(`💎 +${res.bossCoinsAwarded} Boss Coins`, 'gold'), 300);
      return res ?? null;
    } catch (e) {
      haptic('error');
      showToast(getErrorMessage(e, 'Action failed'), 'error');
      return null;
    } finally {
      setBusyKey(null);
    }
  }, [applyState, showToast]);

  const watchAd = useCallback<GameContextType['watchAd']>((rewardType, extra) => {
    const gs = data?.gameState;
    if (gs && (gs.adCountToday ?? 0) >= (gs.maxAdsPerDay ?? 10)) {
      showToast('Daily ad limit reached. Come back tomorrow!', 'error');
      return;
    }
    adExtra.current = extra;
    setAdRequest({ rewardType });
  }, [data?.gameState, showToast]);

  const completeAd = useCallback(() => {
    const req = adRequest;
    setAdRequest(null);
    if (!req) return;
    act('ad', () => gameControllerAdReward({ rewardType: req.rewardType, ...(adExtra.current ?? {}) }));
  }, [adRequest, act]);

  const cancelAd = useCallback(() => {
    setAdRequest(null);
    showToast('Ad skipped — no reward', 'info');
  }, [showToast]);

  const gs = data?.gameState ?? null;
  const elapsed = Math.max(0, (now - fetchedAt.current) / 1000);
  const displayCash = (gs?.cash ?? 0) + (gs?.passiveIncomePerSecond ?? 0) * elapsed;
  const displayEnergy = gs
    ? Math.min(gs.maxEnergy ?? 100, (gs.energy ?? 0) + Math.floor(elapsed / Math.max(1, gs.energyRegenSeconds ?? 20)))
    : 0;

  const value = useMemo<GameContextType>(() => ({
    data, gs, loading, loadError, displayCash, displayEnergy, busyKey, toasts, levelUp, adRequest, dailyOpen,
    refresh, act, watchAd, completeAd, cancelAd, showToast,
    clearLevelUp: () => setLevelUp(null), setDailyOpen,
  }), [data, gs, loading, loadError, displayCash, displayEnergy, busyKey, toasts, levelUp, adRequest, dailyOpen, refresh, act, watchAd, completeAd, cancelAd, showToast]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextType {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside GameProvider');
  return ctx;
}

export { formatCash };
