import { ApiProperty } from '@nestjs/swagger';
import { AchievementDataDto } from './game-state-response.dto';

export class AchievementsResponseDto {
  @ApiProperty({ type: () => [AchievementDataDto] })
  achievements!: AchievementDataDto[];
}

export class CheckAchievementsResponseDto {
  @ApiProperty({ type: () => [AchievementDataDto] })
  achievements!: AchievementDataDto[];

  @ApiProperty({ type: [String] })
  newlyCompleted!: string[];

  @ApiProperty()
  bossCoinsAwarded!: number;
}
