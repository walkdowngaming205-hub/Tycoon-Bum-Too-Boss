// @ts-nocheck

export interface AchievementDataDto {
  id: number;
  achievementKey: string;
  progress: number;
  completed: boolean;
  /** @nullable */
  completedAt: string | null;
}
