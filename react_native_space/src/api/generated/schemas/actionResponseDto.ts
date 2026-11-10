// @ts-nocheck
import type { GameStateResponseDto } from './gameStateResponseDto';

export interface ActionResponseDto {
  success: boolean;
  message: string;
  amount: number;
  leveledUp: boolean;
  /** @nullable */
  newLevel: number | null;
  bossCoinsAwarded: number;
  achievementsUnlocked: string[];
  state: GameStateResponseDto;
}
