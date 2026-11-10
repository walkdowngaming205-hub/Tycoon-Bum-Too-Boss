import { Controller, Get, Post, Body, UseGuards, Req, HttpCode } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GameService } from './game.service';
import { GameStateResponseDto } from './dto/game-state-response.dto';
import {
  ActionResponseDto,
  AdRewardDto,
  BusinessIdDto,
  BuyBusinessDto,
  BuyPropertyDto,
  BuyVehicleDto,
  CollectInvestmentDto,
  HustleDto,
  InvestDto,
  LoanDto,
  ResearchDto,
  ResolveEventDto,
  SpendBossCoinsDto,
} from './dto/actions.dto';
import type { Request } from 'express';

function getUserId(req: Request): number {
  return (req.user as { userId: number }).userId;
}

@ApiTags('Game')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Get('state')
  async getState(@Req() req: Request): Promise<GameStateResponseDto> {
    return this.gameService.getGameState(getUserId(req));
  }

  @Post('hustle')
  @HttpCode(200)
  async hustle(@Req() req: Request, @Body() dto: HustleDto): Promise<ActionResponseDto> {
    return this.gameService.doHustle(getUserId(req), dto.hustleType);
  }

  @Post('business/buy')
  @HttpCode(200)
  async buyBusiness(@Req() req: Request, @Body() dto: BuyBusinessDto): Promise<ActionResponseDto> {
    return this.gameService.buyBusiness(getUserId(req), dto.businessType);
  }

  @Post('business/upgrade')
  @HttpCode(200)
  async upgradeBusiness(@Req() req: Request, @Body() dto: BusinessIdDto): Promise<ActionResponseDto> {
    return this.gameService.upgradeBusiness(getUserId(req), dto.businessId);
  }

  @Post('business/hire')
  @HttpCode(200)
  async hire(@Req() req: Request, @Body() dto: BusinessIdDto): Promise<ActionResponseDto> {
    return this.gameService.hireEmployee(getUserId(req), dto.businessId);
  }

  @Post('property/buy')
  @HttpCode(200)
  async buyProperty(@Req() req: Request, @Body() dto: BuyPropertyDto): Promise<ActionResponseDto> {
    return this.gameService.buyProperty(getUserId(req), dto.propertyKey);
  }

  @Post('vehicle/buy')
  @HttpCode(200)
  async buyVehicle(@Req() req: Request, @Body() dto: BuyVehicleDto): Promise<ActionResponseDto> {
    return this.gameService.buyVehicle(getUserId(req), dto.vehicleKey);
  }

  @Post('invest/research')
  @HttpCode(200)
  async research(@Req() req: Request, @Body() dto: ResearchDto): Promise<ActionResponseDto> {
    return this.gameService.research(getUserId(req), dto.opportunityKey);
  }

  @Post('invest')
  @HttpCode(200)
  async invest(@Req() req: Request, @Body() dto: InvestDto): Promise<ActionResponseDto> {
    return this.gameService.invest(getUserId(req), dto.opportunityKey, dto.amount);
  }

  @Post('invest/collect')
  @HttpCode(200)
  async collectInvestment(@Req() req: Request, @Body() dto: CollectInvestmentDto): Promise<ActionResponseDto> {
    return this.gameService.collectInvestment(getUserId(req), dto.investmentId);
  }

  @Post('event/resolve')
  @HttpCode(200)
  async resolveEvent(@Req() req: Request, @Body() dto: ResolveEventDto): Promise<ActionResponseDto> {
    return this.gameService.resolveEvent(getUserId(req), dto.choiceIndex, dto.adProtection ?? false);
  }

  @Post('daily/claim')
  @HttpCode(200)
  async claimDaily(@Req() req: Request): Promise<ActionResponseDto> {
    return this.gameService.claimDaily(getUserId(req));
  }

  @Post('collect-offline')
  @HttpCode(200)
  async collectOffline(@Req() req: Request): Promise<ActionResponseDto> {
    return this.gameService.collectOffline(getUserId(req));
  }

  @Post('loan/take')
  @HttpCode(200)
  async takeLoan(@Req() req: Request, @Body() dto: LoanDto): Promise<ActionResponseDto> {
    return this.gameService.takeLoan(getUserId(req), dto.amount);
  }

  @Post('loan/repay')
  @HttpCode(200)
  async repayLoan(@Req() req: Request, @Body() dto: LoanDto): Promise<ActionResponseDto> {
    return this.gameService.repayLoan(getUserId(req), dto.amount);
  }

  @Post('boss-coins/spend')
  @HttpCode(200)
  async spendBossCoins(@Req() req: Request, @Body() dto: SpendBossCoinsDto): Promise<ActionResponseDto> {
    return this.gameService.spendBossCoins(getUserId(req), dto.itemKey, dto.targetBusinessId, dto.newName);
  }

  @Post('ad-reward')
  @HttpCode(200)
  async adReward(@Req() req: Request, @Body() dto: AdRewardDto): Promise<ActionResponseDto> {
    return this.gameService.recordAdReward(getUserId(req), dto.rewardType, dto.targetBusinessId, dto.opportunityKey);
  }
}
