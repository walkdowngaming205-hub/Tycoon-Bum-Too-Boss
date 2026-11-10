// @ts-nocheck
import type { LeaderboardEntryDto } from './leaderboardEntryDto';

export interface LeaderboardResponseDto {
  entries: LeaderboardEntryDto[];
  /** @nullable */
  myRank: LeaderboardEntryDto | null;
}
