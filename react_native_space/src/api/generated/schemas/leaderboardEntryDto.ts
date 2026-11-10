// @ts-nocheck

export interface LeaderboardEntryDto {
  rank: number;
  userId: number;
  playerName: string;
  avatarEmoji: string;
  netWorth?: number;
  level?: number;
  empireValue?: number;
  businessCount?: number;
  investmentReturns?: number;
  winRate?: number;
  reputation?: number;
  title?: string;
  weeklyGrowth?: number;
}
