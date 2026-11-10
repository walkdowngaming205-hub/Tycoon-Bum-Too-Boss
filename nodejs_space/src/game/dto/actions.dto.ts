import { IsString, IsIn, IsOptional, IsInt, IsNumber, Min, Max, IsBoolean, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GameStateResponseDto } from './game-state-response.dto';
import { HUSTLE_KEYS, BUSINESS_KEYS, PROPERTY_DEFS, VEHICLE_DEFS, INVESTMENT_DEFS, BOSS_COIN_ITEMS } from '../../constants/game.constants';

export class HustleDto {
  @IsString()
  @IsIn(HUSTLE_KEYS)
  hustleType!: string;
}

export class BuyBusinessDto {
  @IsString()
  @IsIn(BUSINESS_KEYS)
  businessType!: string;
}

export class BusinessIdDto {
  @IsInt()
  businessId!: number;
}

export class BuyPropertyDto {
  @IsString()
  @IsIn(Object.keys(PROPERTY_DEFS))
  propertyKey!: string;
}

export class BuyVehicleDto {
  @IsString()
  @IsIn(Object.keys(VEHICLE_DEFS))
  vehicleKey!: string;
}

export class ResearchDto {
  @IsString()
  @IsIn(Object.keys(INVESTMENT_DEFS))
  opportunityKey!: string;
}

export class InvestDto {
  @IsString()
  @IsIn(Object.keys(INVESTMENT_DEFS))
  opportunityKey!: string;

  @IsNumber()
  @Min(10)
  amount!: number;
}

export class CollectInvestmentDto {
  @IsInt()
  investmentId!: number;
}

export class ResolveEventDto {
  @IsInt()
  @Min(0)
  @Max(3)
  choiceIndex!: number;

  @IsOptional()
  @IsBoolean()
  adProtection?: boolean;
}

export class LoanDto {
  @IsNumber()
  @Min(1)
  amount!: number;
}

export class SpendBossCoinsDto {
  @IsString()
  @IsIn(Object.keys(BOSS_COIN_ITEMS))
  itemKey!: string;

  @IsOptional()
  @IsInt()
  targetBusinessId?: number;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  newName?: string;
}

export class AdRewardDto {
  @IsString()
  @IsIn(['offline_double', 'business_boost', 'energy_refill', 'free_research', 'daily_double', 'tap_boost'])
  rewardType!: string;

  @IsOptional()
  @IsInt()
  targetBusinessId?: number;

  @IsOptional()
  @IsString()
  @IsIn(Object.keys(INVESTMENT_DEFS))
  opportunityKey?: string;
}

export class ActionResponseDto {
  @ApiProperty() success!: boolean;
  @ApiProperty() message!: string;
  @ApiProperty() amount!: number;
  @ApiProperty() leveledUp!: boolean;
  @ApiProperty({ nullable: true }) newLevel!: number | null;
  @ApiProperty() bossCoinsAwarded!: number;
  @ApiProperty({ type: [String] }) achievementsUnlocked!: string[];
  @ApiProperty({ type: () => GameStateResponseDto }) state!: GameStateResponseDto;
}
