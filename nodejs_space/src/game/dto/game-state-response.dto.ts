import { ApiProperty } from '@nestjs/swagger';

export class GameStateDataDto {
  @ApiProperty() id!: number;
  @ApiProperty() cash!: number;
  @ApiProperty() xp!: number;
  @ApiProperty() xpToNext!: number;
  @ApiProperty() level!: number;
  @ApiProperty() bossCoins!: number;
  @ApiProperty() totalEarned!: number;
  @ApiProperty() totalHustleTaps!: number;
  @ApiProperty() reputation!: number;
  @ApiProperty() investmentReturns!: number;
  @ApiProperty() investmentWinRate!: number;
  @ApiProperty() investmentsMade!: number;
  @ApiProperty() investmentsWon!: number;
  @ApiProperty() weekStartNetWorth!: number;
  @ApiProperty() weekStartDate!: string;
  @ApiProperty() offlineMaxHours!: number;
  @ApiProperty({ nullable: true }) xpBoostUntil!: string | null;
  @ApiProperty({ nullable: true }) tapBoostUntil!: string | null;
  @ApiProperty() lastActiveAt!: string;
  @ApiProperty() adCountToday!: number;
  @ApiProperty() maxAdsPerDay!: number;
  @ApiProperty() energy!: number;
  @ApiProperty() maxEnergy!: number;
  @ApiProperty() energyRegenSeconds!: number;
  @ApiProperty() energyUpdatedAt!: string;
  @ApiProperty() dailyStreak!: number;
  @ApiProperty() dailyAvailable!: boolean;
  @ApiProperty() nextDailyDay!: number;
  @ApiProperty() debt!: number;
  @ApiProperty() creditLimit!: number;
  @ApiProperty() netWorth!: number;
  @ApiProperty() passiveIncomePerSecond!: number;
  @ApiProperty() businessIncomePerSecond!: number;
  @ApiProperty() rentIncomePerSecond!: number;
  @ApiProperty() hustleBonus!: number;
  @ApiProperty() globalMultiplier!: number;
  @ApiProperty() rankIndex!: number;
  @ApiProperty() rankTitle!: string;
  @ApiProperty() researchCost!: number;
  @ApiProperty({ type: [String] }) properties!: string[];
  @ApiProperty({ type: [String] }) vehicles!: string[];
  @ApiProperty({ type: [String] }) unlockedDistricts!: string[];
}

export class BusinessDataDto {
  @ApiProperty() id!: number;
  @ApiProperty() businessType!: string;
  @ApiProperty() level!: number;
  @ApiProperty() employees!: number;
  @ApiProperty({ nullable: true }) customName!: string | null;
  @ApiProperty({ nullable: true }) incomeBoostUntil!: string | null;
  @ApiProperty() purchasedAt!: string;
  @ApiProperty() incomePerSecond!: number;
  @ApiProperty() grossPerSecond!: number;
  @ApiProperty() expensesPerSecond!: number;
  @ApiProperty({ nullable: true }) upgradeCost!: number | null;
  @ApiProperty({ nullable: true }) hireCost!: number | null;
  @ApiProperty() value!: number;
}

export class AchievementDataDto {
  @ApiProperty() id!: number;
  @ApiProperty() achievementKey!: string;
  @ApiProperty() progress!: number;
  @ApiProperty() completed!: boolean;
  @ApiProperty({ nullable: true }) completedAt!: string | null;
}

export class OfflineIncomeDto {
  @ApiProperty() amount!: number;
  @ApiProperty() secondsAway!: number;
  @ApiProperty() cappedAtHours!: number;
}

export class InvestmentDataDto {
  @ApiProperty() id!: number;
  @ApiProperty() opportunityKey!: string;
  @ApiProperty() amount!: number;
  @ApiProperty() researched!: boolean;
  @ApiProperty({ nullable: true }) sentiment!: string | null;
  @ApiProperty({ enum: ['active', 'won', 'lost'] }) status!: string;
  @ApiProperty({ nullable: true }) multiplier!: number | null;
  @ApiProperty({ nullable: true }) payout!: number | null;
  @ApiProperty() maturesAt!: string;
  @ApiProperty() createdAt!: string;
}

export class ResearchHintDto {
  @ApiProperty() opportunityKey!: string;
  @ApiProperty({ enum: ['bearish', 'neutral', 'bullish'] }) sentiment!: string;
}

export class PendingEventDto {
  @ApiProperty() key!: string;
  @ApiProperty() title!: string;
  @ApiProperty() description!: string;
  @ApiProperty({ type: [String] }) choices!: string[];
}

export class GameStateResponseDto {
  @ApiProperty({ type: () => GameStateDataDto }) gameState!: GameStateDataDto;
  @ApiProperty({ type: () => [BusinessDataDto] }) businesses!: BusinessDataDto[];
  @ApiProperty({ type: () => [AchievementDataDto] }) achievements!: AchievementDataDto[];
  @ApiProperty({ type: () => [InvestmentDataDto] }) investments!: InvestmentDataDto[];
  @ApiProperty({ type: () => [ResearchHintDto] }) research!: ResearchHintDto[];
  @ApiProperty({ nullable: true, type: () => PendingEventDto }) pendingEvent!: PendingEventDto | null;
  @ApiProperty({ nullable: true, type: () => OfflineIncomeDto }) offlineIncome!: OfflineIncomeDto | null;
  @ApiProperty() playerName!: string;
  @ApiProperty() avatarEmoji!: string;
  @ApiProperty() hasAvatarFrame!: boolean;
}
