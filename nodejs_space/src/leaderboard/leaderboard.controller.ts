import { Controller, Get, Param, Query, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardResponseDto } from './dto/leaderboard-response.dto';
import type { Request } from 'express';

@ApiTags('Leaderboard')
@UseGuards(JwtAuthGuard)
@Controller('api/leaderboard')
export class LeaderboardController {
  constructor(private leaderboardService: LeaderboardService) {}

  @Get(':type')
  async getLeaderboard(
    @Req() req: Request,
    @Param('type') type: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ): Promise<LeaderboardResponseDto> {
    const userId = (req.user as { userId: number }).userId;
    return this.leaderboardService.getLeaderboard(userId, type, limit ?? 50);
  }
}
