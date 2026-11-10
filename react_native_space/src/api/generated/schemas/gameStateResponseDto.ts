// @ts-nocheck
import type { AchievementDataDto } from './achievementDataDto';
import type { BusinessDataDto } from './businessDataDto';
import type { GameStateDataDto } from './gameStateDataDto';
import type { InvestmentDataDto } from './investmentDataDto';
import type { OfflineIncomeDto } from './offlineIncomeDto';
import type { PendingEventDto } from './pendingEventDto';
import type { ResearchHintDto } from './researchHintDto';

export interface GameStateResponseDto {
  gameState: GameStateDataDto;
  businesses: BusinessDataDto[];
  achievements: AchievementDataDto[];
  investments: InvestmentDataDto[];
  research: ResearchHintDto[];
  /** @nullable */
  pendingEvent: PendingEventDto | null;
  /** @nullable */
  offlineIncome: OfflineIncomeDto | null;
  playerName: string;
  avatarEmoji: string;
  hasAvatarFrame: boolean;
}
