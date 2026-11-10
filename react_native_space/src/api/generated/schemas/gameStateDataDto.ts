// @ts-nocheck

export interface GameStateDataDto {
  id: number;
  cash: number;
  xp: number;
  xpToNext: number;
  level: number;
  bossCoins: number;
  totalEarned: number;
  totalHustleTaps: number;
  reputation: number;
  investmentReturns: number;
  investmentWinRate: number;
  investmentsMade: number;
  investmentsWon: number;
  weekStartNetWorth: number;
  weekStartDate: string;
  offlineMaxHours: number;
  /** @nullable */
  xpBoostUntil: string | null;
  tapBoostUntil: string | null;
  lastActiveAt: string;
  adCountToday: number;
  maxAdsPerDay: number;
  energy: number;
  maxEnergy: number;
  energyRegenSeconds: number;
  energyUpdatedAt: string;
  dailyStreak: number;
  dailyAvailable: boolean;
  nextDailyDay: number;
  debt: number;
  creditLimit: number;
  netWorth: number;
  passiveIncomePerSecond: number;
  businessIncomePerSecond: number;
  rentIncomePerSecond: number;
  hustleBonus: number;
  globalMultiplier: number;
  rankIndex: number;
  rankTitle: string;
  researchCost: number;
  properties: string[];
  vehicles: string[];
  unlockedDistricts: string[];
}
