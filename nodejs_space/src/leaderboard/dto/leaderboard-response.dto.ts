import { ApiProperty } from '@nestjs/swagger';

export class LeaderboardEntryDto {
  @ApiProperty() rank!: number;
  @ApiProperty() userId!: number;
  @ApiProperty() playerName!: string;
  @ApiProperty() avatarEmoji!: string;
  @ApiProperty({ required: false }) netWorth?: number;
  @ApiProperty({ required: false }) level?: number;
  @ApiProperty({ required: false }) empireValue?: number;
  @ApiProperty({ required: false }) businessCount?: number;
  @ApiProperty({ required: false }) investmentReturns?: number;
  @ApiProperty({ required: false }) winRate?: number;
  @ApiProperty({ required: false }) reputation?: number;
  @ApiProperty({ required: false }) title?: string;
  @ApiProperty({ required: false }) weeklyGrowth?: number;
}

export class LeaderboardResponseDto {
  @ApiProperty({ type: () => [LeaderboardEntryDto] })
  entries!: LeaderboardEntryDto[];

  @ApiProperty({ nullable: true, type: () => LeaderboardEntryDto })
  myRank!: LeaderboardEntryDto | null;
}
