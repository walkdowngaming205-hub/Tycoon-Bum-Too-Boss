import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  HUSTLE_DEFS,
  BUSINESS_DEFS,
  BOSS_COIN_ITEMS,
  ACHIEVEMENT_DEFS,
  ACHIEVEMENT_KEYS,
  PROPERTY_DEFS,
  VEHICLE_DEFS,
  INVESTMENT_DEFS,
  EVENT_DEFS,
  EVENT_KEYS,
  EVENT_CHANCE,
  EVENT_MIN_INTERVAL_SECONDS,
  DAILY_REWARDS,
  DISTRICT_DEFS,
  RANKS,
  MAX_ENERGY,
  ENERGY_REGEN_SECONDS,
  MAX_BUSINESS_LEVEL,
  MAX_EMPLOYEES,
  SENTIMENT_WIN_SHIFT,
  computeEconomy,
  currentBucket,
  getBusinessGross,
  getBusinessIncomePerSecond,
  getBusinessValue,
  getDailyBaseCash,
  getHireCost,
  getRankIndex,
  getResearchCost,
  getSentiment,
  getUpgradeCost,
  isDistrictUnlocked,
  xpThresholdForLevel,
} from '../constants/game.constants';
import { GameStateResponseDto } from './dto/game-state-response.dto';
import { ActionResponseDto } from './dto/actions.dto';

const MAX_ADS_PER_DAY = 10;
const ONLINE_WINDOW_SECONDS = 120;
const MAX_ACTIVE_INVESTMENTS = 3;

type FullUser = Prisma.userGetPayload<{ include: { gameState: true; businesses: true; achievements: true; investments: true } }>;
type GS = NonNullable<FullUser['gameState']>;

function dayStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}
function mondayOf(now: Date): Date {
  const day = now.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  const m = new Date(now);
  m.setUTCDate(now.getUTCDate() + diff);
  m.setUTCHours(0, 0, 0, 0);
  return m;
}
function clampRep(r: number): number {
  return Math.max(0, Math.min(100, Math.round(r)));
}
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);

  constructor(private prisma: PrismaService) {}

  // ---------------------------------------------------------------- core

  private async loadUser(userId: number): Promise<FullUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { gameState: true, businesses: true, achievements: true, investments: { orderBy: { createdAt: 'desc' }, take: 15 } },
    });
    if (!user?.gameState) throw new NotFoundException('Game state not found');
    return user;
  }

  private economyFor(user: FullUser, gs: GS, at = new Date()) {
    const activeInvestmentTotal = user.investments.filter((i) => i.status === 'active').reduce((s, i) => s + i.amount, 0);
    return computeEconomy(
      {
        cash: gs.cash,
        debt: gs.debt,
        properties: gs.properties,
        vehicles: gs.vehicles,
        businesses: user.businesses.map((b) => ({ businessType: b.businessType, level: b.level, employees: b.employees, incomeBoostUntil: b.incomeBoostUntil })),
        activeInvestmentTotal,
      },
      at,
    );
  }

  /** Applies passive income, energy regen, resets and (optionally) random events. Returns the fresh user. */
  private async settle(userId: number, allowEvents = false): Promise<FullUser> {
    const user = await this.loadUser(userId);
    const gs = user.gameState!;
    const now = new Date();
    const econ = this.economyFor(user, gs, gs.lastActiveAt);
    const data: Prisma.game_stateUpdateInput = { lastActiveAt: now };

    const elapsed = Math.max(0, Math.floor((now.getTime() - gs.lastActiveAt.getTime()) / 1000));
    if (elapsed <= ONLINE_WINDOW_SECONDS) {
      const earned = econ.passiveIncomePerSecond * elapsed;
      if (earned > 0) {
        data.cash = gs.cash + earned;
        data.totalEarned = gs.totalEarned + earned;
      }
    } else if (econ.passiveIncomePerSecond > 0) {
      const capped = Math.min(elapsed, gs.offlineMaxHours * 3600);
      data.pendingOffline = gs.pendingOffline + econ.passiveIncomePerSecond * capped;
      data.pendingOfflineSeconds = gs.pendingOfflineSeconds + elapsed;
    }

    // Energy regen
    if (gs.energy < MAX_ENERGY) {
      const ticks = Math.floor((now.getTime() - gs.energyUpdatedAt.getTime()) / (ENERGY_REGEN_SECONDS * 1000));
      if (ticks > 0) {
        const newEnergy = Math.min(MAX_ENERGY, gs.energy + ticks);
        data.energy = newEnergy;
        data.energyUpdatedAt = newEnergy >= MAX_ENERGY ? now : new Date(gs.energyUpdatedAt.getTime() + ticks * ENERGY_REGEN_SECONDS * 1000);
      }
    } else {
      data.energyUpdatedAt = now;
    }

    // Daily ad reset
    if (dayStr(now) !== dayStr(gs.adCountResetDate)) {
      data.adCountToday = 0;
      data.adCountResetDate = now;
    }

    // Weekly reset (Monday UTC)
    const monday = mondayOf(now);
    if (gs.weekStartDate < monday) {
      data.weekStartDate = monday;
      data.weekStartNetWorth = econ.netWorth;
    }

    // Random decision events
    if (allowEvents && !gs.pendingEvent && user.businesses.length > 0) {
      const since = (now.getTime() - gs.lastEventAt.getTime()) / 1000;
      if (since >= EVENT_MIN_INTERVAL_SECONDS && Math.random() < EVENT_CHANCE) {
        data.pendingEvent = EVENT_KEYS[Math.floor(Math.random() * EVENT_KEYS.length)];
        data.lastEventAt = now;
      }
    }

    await this.prisma.game_state.update({ where: { userId }, data });
    return this.loadUser(userId);
  }

  private buildState(user: FullUser): GameStateResponseDto {
    const gs = user.gameState!;
    const now = new Date();
    const econ = this.economyFor(user, gs, now);
    const rankIndex = getRankIndex(econ.netWorth);
    const bucket = currentBucket();

    const today = dayStr(now);
    const yesterday = dayStr(new Date(now.getTime() - 86400000));
    const lastClaim = gs.lastDailyClaim ? dayStr(gs.lastDailyClaim) : null;
    const dailyAvailable = lastClaim !== today;
    const streakAlive = lastClaim === yesterday || lastClaim === today;
    const nextDailyDay = dailyAvailable ? ((streakAlive ? gs.dailyStreak : 0) % 7) + 1 : ((gs.dailyStreak - 1) % 7) + 1;

    const research = gs.researched
      .map((r) => r.split('@'))
      .filter(([, b]) => Number(b) === bucket)
      .map(([k]) => ({ opportunityKey: k, sentiment: getSentiment(user.id, k, bucket) }));

    const event = gs.pendingEvent ? EVENT_DEFS[gs.pendingEvent] : null;

    return {
      gameState: {
        id: gs.id,
        cash: round2(gs.cash),
        xp: gs.xp,
        xpToNext: xpThresholdForLevel(gs.level),
        level: gs.level,
        bossCoins: gs.bossCoins,
        totalEarned: round2(gs.totalEarned),
        totalHustleTaps: gs.totalHustleTaps,
        reputation: gs.reputation,
        investmentReturns: round2(gs.investmentReturns),
        investmentWinRate: gs.investmentWinRate,
        investmentsMade: gs.investmentsMade,
        investmentsWon: gs.investmentsWon,
        weekStartNetWorth: gs.weekStartNetWorth,
        weekStartDate: gs.weekStartDate.toISOString(),
        offlineMaxHours: gs.offlineMaxHours,
        xpBoostUntil: gs.xpBoostUntil && gs.xpBoostUntil > now ? gs.xpBoostUntil.toISOString() : null,
        tapBoostUntil: gs.tapBoostUntil && gs.tapBoostUntil > now
          ? gs.tapBoostUntil.toISOString()
          : null,
        lastActiveAt: gs.lastActiveAt.toISOString(),
        adCountToday: gs.adCountToday,
        maxAdsPerDay: MAX_ADS_PER_DAY,
        energy: gs.energy,
        maxEnergy: MAX_ENERGY,
        energyRegenSeconds: ENERGY_REGEN_SECONDS,
        energyUpdatedAt: gs.energyUpdatedAt.toISOString(),
        dailyStreak: streakAlive ? gs.dailyStreak : 0,
        dailyAvailable,
        nextDailyDay,
        debt: round2(gs.debt),
        creditLimit: this.creditLimit(gs.level, econ.netWorth + gs.debt),
        netWorth: round2(econ.netWorth),
        passiveIncomePerSecond: round2(econ.passiveIncomePerSecond),
        businessIncomePerSecond: round2(econ.businessIncome),
        rentIncomePerSecond: round2(econ.rentIncome),
        hustleBonus: econ.hustleBonus,
        globalMultiplier: econ.globalMult,
        rankIndex,
        rankTitle: RANKS[rankIndex].title,
        researchCost: getResearchCost(gs.level),
        properties: gs.properties,
        vehicles: gs.vehicles,
        unlockedDistricts: Object.keys(DISTRICT_DEFS).filter((d) => isDistrictUnlocked(d, econ.netWorth, gs.reputation)),
      },
      businesses: user.businesses
        .sort((a, b) => (BUSINESS_DEFS[a.businessType]?.cost ?? 0) - (BUSINESS_DEFS[b.businessType]?.cost ?? 0))
        .map((b) => {
          const boosted = b.incomeBoostUntil ? b.incomeBoostUntil > now : false;
          const gross = getBusinessGross(b.businessType, b.level, b.employees) * econ.globalMult * (boosted ? 2 : 1);
          const net = getBusinessIncomePerSecond(b.businessType, b.level, boosted, b.employees, econ.globalMult);
          return {
            id: b.id,
            businessType: b.businessType,
            level: b.level,
            employees: b.employees,
            customName: b.customName,
            incomeBoostUntil: boosted ? b.incomeBoostUntil!.toISOString() : null,
            purchasedAt: b.purchasedAt.toISOString(),
            incomePerSecond: round2(net),
            grossPerSecond: round2(gross),
            expensesPerSecond: round2(gross - net),
            upgradeCost: b.level < MAX_BUSINESS_LEVEL ? getUpgradeCost(b.businessType, b.level) : null,
            hireCost: b.employees < MAX_EMPLOYEES ? getHireCost(b.businessType, b.employees) : null,
            value: Math.round(getBusinessValue(b.businessType, b.level, b.employees)),
          };
        }),
      achievements: user.achievements.map((a) => ({
        id: a.id,
        achievementKey: a.achievementKey,
        progress: a.progress,
        completed: a.completed,
        completedAt: a.completedAt?.toISOString() ?? null,
      })),
      investments: user.investments.map((i) => ({
        id: i.id,
        opportunityKey: i.opportunityKey,
        amount: i.amount,
        researched: i.researched,
        sentiment: i.researched ? i.sentiment : null,
        status: i.status,
        multiplier: i.multiplier,
        payout: i.payout,
        maturesAt: i.maturesAt.toISOString(),
        createdAt: i.createdAt.toISOString(),
      })),
      research,
      pendingEvent: event && gs.pendingEvent
        ? { key: gs.pendingEvent, title: event.title, description: event.description, choices: event.choices.map((c) => c.label) }
        : null,
      offlineIncome: gs.pendingOffline > 0
        ? { amount: round2(gs.pendingOffline), secondsAway: gs.pendingOfflineSeconds, cappedAtHours: gs.offlineMaxHours }
        : null,
      playerName: user.playerName,
      avatarEmoji: user.avatarEmoji,
      hasAvatarFrame: gs.hasAvatarFrame,
    };
  }

  private creditLimit(level: number, grossNetWorth: number): number {
    return Math.round(Math.max(500, level * 1500 + Math.max(0, grossNetWorth) * 0.3));
  }

  private async respond(
    userId: number,
    opts: { message: string; amount?: number; success?: boolean; leveledUp?: boolean; newLevel?: number | null; bossCoinsAwarded?: number },
  ): Promise<ActionResponseDto> {
    const { unlocked, coins } = await this.checkAndUpdateAchievements(userId);
    const user = await this.loadUser(userId);
    return {
      success: opts.success ?? true,
      message: opts.message,
      amount: round2(opts.amount ?? 0),
      leveledUp: opts.leveledUp ?? false,
      newLevel: opts.newLevel ?? null,
      bossCoinsAwarded: (opts.bossCoinsAwarded ?? 0) + coins,
      achievementsUnlocked: unlocked,
      state: this.buildState(user),
    };
  }

  private async consumeAd(gs: GS): Promise<number> {
    const now = new Date();
    let count = dayStr(now) !== dayStr(gs.adCountResetDate) ? 0 : gs.adCountToday;
    if (count >= MAX_ADS_PER_DAY) throw new BadRequestException('Daily ad limit reached. Come back tomorrow!');
    count++;
    await this.prisma.game_state.update({ where: { userId: gs.userId }, data: { adCountToday: count, adCountResetDate: now } });
    return count;
  }

  /** Applies XP and returns level-up info + coin bonus. */
  private applyXp(gs: GS, gain: number) {
    let xp = gs.xp + gain;
    let level = gs.level;
    let coins = 0;
    let leveledUp = false;
    let threshold = xpThresholdForLevel(level);
    while (xp >= threshold) {
      xp -= threshold;
      level++;
      leveledUp = true;
      coins += level % 5 === 0 ? 20 : 2;
      threshold = xpThresholdForLevel(level);
    }
    return { xp, level, coins, leveledUp };
  }

  // ---------------------------------------------------------------- endpoints

  async getGameState(userId: number): Promise<GameStateResponseDto> {
    const user = await this.settle(userId, true);
    return this.buildState(user);
  }



async doHustle(userId: number, hustleType: string): Promise<ActionResponseDto> {
  const def = HUSTLE_DEFS[hustleType];
  if (!def) throw new BadRequestException('Invalid hustle type');

  const user = await this.settle(userId);
  const gs = user.gameState!;

  if (gs.level < def.unlockLevel) {
    throw new BadRequestException(`Requires level ${def.unlockLevel}`);
  }

  const econ = this.economyFor(user, gs);
  const now = new Date();
  const success = Math.random() < def.successRate;

  const tapBoostActive =
    !!gs.tapBoostUntil && gs.tapBoostUntil > now;

  const cashBoost = tapBoostActive ? 2 : 1;
  const repBoost = tapBoostActive ? 2 : 1;

  const repMult = 1 + gs.reputation / 100;

  const amount = success
    ? def.reward * repMult * (1 + econ.hustleBonus) * cashBoost
    : -Math.min(gs.cash, def.failLoss);

  const repGain = success ? def.rep * repBoost : 0;

  const xpGain =
    (success ? def.xp : Math.ceil(def.xp / 2)) *
    (gs.xpBoostUntil && gs.xpBoostUntil > now ? 2 : 1);

  const lv = this.applyXp(gs, xpGain);

  await this.prisma.game_state.update({
    where: { userId },
    data: {
      cash: Math.max(0, gs.cash + amount),
      totalEarned: gs.totalEarned + Math.max(0, amount),
      totalHustleTaps: gs.totalHustleTaps + 1,
      xp: lv.xp,
      level: lv.level,
      bossCoins: gs.bossCoins + lv.coins,
      totalBossCoinsEarned: gs.totalBossCoinsEarned + lv.coins,
      reputation: clampRep(gs.reputation + repGain),
    },
  });

  return this.respond(userId, {
    success,
    message: success
      ? `${def.name} paid off!${tapBoostActive ? ' 2x boost active!' : ''}`
      : `${def.name} went wrong. You lost money.`,
    amount,
    leveledUp: lv.leveledUp,
    newLevel: lv.leveledUp ? lv.level : null,
    bossCoinsAwarded: lv.coins,
  });
}



  async buyBusiness(userId: number, businessType: string): Promise<ActionResponseDto> {
    const def = BUSINESS_DEFS[businessType];
    if (!def) throw new BadRequestException('Invalid business type');
    const user = await this.settle(userId);
    const gs = user.gameState!;
    if (user.businesses.some((b) => b.businessType === businessType)) throw new BadRequestException('You already own this business');
    if (gs.level < def.unlockLevel) throw new BadRequestException(`Requires level ${def.unlockLevel}`);
    if (gs.reputation < def.minReputation) throw new BadRequestException(`Requires ${def.minReputation} reputation`);
    const econ = this.economyFor(user, gs);
    if (!isDistrictUnlocked(def.district, econ.netWorth, gs.reputation)) throw new BadRequestException(`Unlock ${DISTRICT_DEFS[def.district].name} first`);
    if (gs.cash < def.cost) throw new BadRequestException('Not enough cash');

    await this.prisma.game_state.update({
      where: { userId },
      data: { cash: gs.cash - def.cost, reputation: clampRep(gs.reputation + def.repGain) },
    });
    await this.prisma.business.create({ data: { userId, businessType, level: 1 } });
    this.logger.log(`User ${userId} bought ${businessType}`);
    return this.respond(userId, { message: `You now own ${def.name}!`, amount: -def.cost });
  }

  async upgradeBusiness(userId: number, businessId: number): Promise<ActionResponseDto> {
    const user = await this.settle(userId);
    const gs = user.gameState!;
    const biz = user.businesses.find((b) => b.id === businessId);
    if (!biz) throw new NotFoundException('Business not found');
    if (biz.level >= MAX_BUSINESS_LEVEL) throw new BadRequestException('Already max level');
    const cost = getUpgradeCost(biz.businessType, biz.level);
    if (gs.cash < cost) throw new BadRequestException('Not enough cash');

    await this.prisma.game_state.update({ where: { userId }, data: { cash: gs.cash - cost, reputation: clampRep(gs.reputation + (biz.level % 3 === 2 ? 1 : 0)) } });
    await this.prisma.business.update({ where: { id: businessId }, data: { level: biz.level + 1 } });
    return this.respond(userId, { message: `Upgraded to Level ${biz.level + 1}`, amount: -cost });
  }

  async hireEmployee(userId: number, businessId: number): Promise<ActionResponseDto> {
    const user = await this.settle(userId);
    const gs = user.gameState!;
    const biz = user.businesses.find((b) => b.id === businessId);
    if (!biz) throw new NotFoundException('Business not found');
    if (biz.employees >= MAX_EMPLOYEES) throw new BadRequestException('Fully staffed');
    const cost = getHireCost(biz.businessType, biz.employees);
    if (gs.cash < cost) throw new BadRequestException('Not enough cash');

    await this.prisma.game_state.update({ where: { userId }, data: { cash: gs.cash - cost } });
    await this.prisma.business.update({ where: { id: businessId }, data: { employees: biz.employees + 1 } });
    return this.respond(userId, { message: 'New employee hired (+20% revenue)', amount: -cost });
  }

  async buyProperty(userId: number, key: string): Promise<ActionResponseDto> {
    const def = PROPERTY_DEFS[key];
    if (!def) throw new BadRequestException('Invalid property');
    const user = await this.settle(userId);
    const gs = user.gameState!;
    if (gs.properties.includes(key)) throw new BadRequestException('Already owned');
    const econ = this.economyFor(user, gs);
    if (!isDistrictUnlocked(def.district, econ.netWorth, gs.reputation)) throw new BadRequestException(`Unlock ${DISTRICT_DEFS[def.district].name} first`);
    if (gs.cash < def.cost) throw new BadRequestException('Not enough cash');
    await this.prisma.game_state.update({
      where: { userId },
      data: { cash: gs.cash - def.cost, properties: [...gs.properties, key], reputation: clampRep(gs.reputation + def.rep) },
    });
    return this.respond(userId, { message: `${def.name} is yours. Rent is rolling in!`, amount: -def.cost });
  }

  async buyVehicle(userId: number, key: string): Promise<ActionResponseDto> {
    const def = VEHICLE_DEFS[key];
    if (!def) throw new BadRequestException('Invalid vehicle');
    const user = await this.settle(userId);
    const gs = user.gameState!;
    if (gs.vehicles.includes(key)) throw new BadRequestException('Already owned');
    const econ = this.economyFor(user, gs);
    if (!isDistrictUnlocked(def.district, econ.netWorth, gs.reputation)) throw new BadRequestException(`Unlock ${DISTRICT_DEFS[def.district].name} first`);
    if (gs.cash < def.cost) throw new BadRequestException('Not enough cash');
    await this.prisma.game_state.update({
      where: { userId },
      data: { cash: gs.cash - def.cost, vehicles: [...gs.vehicles, key], reputation: clampRep(gs.reputation + def.rep) },
    });
    return this.respond(userId, { message: `Keys to the ${def.name}. Looking good.`, amount: -def.cost });
  }

  async research(userId: number, key: string, free = false): Promise<ActionResponseDto> {
    const user = await this.settle(userId);
    const gs = user.gameState!;
    const bucket = currentBucket();
    const tag = `${key}@${bucket}`;
    if (gs.researched.includes(tag)) throw new BadRequestException('Already researched this market window');
    const cost = free ? 0 : getResearchCost(gs.level);
    if (gs.cash < cost) throw new BadRequestException('Not enough cash for research');
    const kept = gs.researched.filter((r) => Number(r.split('@')[1]) === bucket);
    await this.prisma.game_state.update({ where: { userId }, data: { cash: gs.cash - cost, researched: [...kept, tag] } });
    const sentiment = getSentiment(userId, key, bucket);
    return this.respond(userId, { message: `Analysts say: ${sentiment.toUpperCase()}`, amount: -cost });
  }

  async invest(userId: number, key: string, amount: number): Promise<ActionResponseDto> {
    const def = INVESTMENT_DEFS[key];
    if (!def) throw new BadRequestException('Invalid opportunity');
    const user = await this.settle(userId);
    const gs = user.gameState!;
    if (gs.level < def.minLevel) throw new BadRequestException(`Requires level ${def.minLevel}`);
    if (user.investments.filter((i) => i.status === 'active').length >= MAX_ACTIVE_INVESTMENTS) throw new BadRequestException(`Max ${MAX_ACTIVE_INVESTMENTS} active investments`);
    if (gs.cash < amount) throw new BadRequestException('Not enough cash');

    const bucket = currentBucket();
    const researched = gs.researched.includes(`${key}@${bucket}`);
    await this.prisma.investment.create({
      data: {
        userId,
        opportunityKey: key,
        amount,
        sentiment: getSentiment(userId, key, bucket),
        researched,
        maturesAt: new Date(Date.now() + def.minutes * 60000),
      },
    });
    await this.prisma.game_state.update({ where: { userId }, data: { cash: gs.cash - amount, investmentsMade: gs.investmentsMade + 1 } });
    return this.respond(userId, { message: `Invested in ${def.name}. Matures in ${def.minutes} min.`, amount: -amount });
  }

  async collectInvestment(userId: number, investmentId: number): Promise<ActionResponseDto> {
    const user = await this.settle(userId);
    const gs = user.gameState!;
    const inv = await this.prisma.investment.findFirst({ where: { id: investmentId, userId } });
    if (!inv) throw new NotFoundException('Investment not found');
    if (inv.status !== 'active') throw new BadRequestException('Already collected');
    if (inv.maturesAt > new Date()) throw new BadRequestException('Not matured yet');
    const def = INVESTMENT_DEFS[inv.opportunityKey];
    if (!def) throw new BadRequestException('Invalid opportunity');

    const winChance = Math.max(0.05, Math.min(0.95, def.baseWin + (SENTIMENT_WIN_SHIFT[inv.sentiment] ?? 0)));
    const won = Math.random() < winChance;
    const r = Math.random();
    const multiplier = won ? 1.05 + (def.maxMult - 1.05) * Math.pow(r, 1.6) : def.minMult + (1 - def.minMult) * r * 0.9;
    const payout = round2(inv.amount * multiplier);
    const profit = payout - inv.amount;
    const wins = gs.investmentsWon + (won ? 1 : 0);
    const resolvedCount = await this.prisma.investment.count({ where: { userId, status: { not: 'active' } } });

    await this.prisma.investment.update({ where: { id: inv.id }, data: { status: won ? 'won' : 'lost', multiplier, payout, resolvedAt: new Date() } });
    await this.prisma.game_state.update({
      where: { userId },
      data: {
        cash: gs.cash + payout,
        totalEarned: gs.totalEarned + Math.max(0, profit),
        investmentReturns: gs.investmentReturns + profit,
        investmentsWon: wins,
        investmentWinRate: round2((wins / (resolvedCount + 1)) * 100),
        reputation: clampRep(gs.reputation + (won && multiplier > 2 ? 2 : 0)),
      },
    });
    return this.respond(userId, {
      success: won,
      message: won ? `${def.name} paid ${multiplier.toFixed(2)}x!` : `${def.name} tanked (${multiplier.toFixed(2)}x)`,
      amount: profit,
    });
  }

  async resolveEvent(userId: number, choiceIndex: number, adProtection = false): Promise<ActionResponseDto> {
    const user = await this.settle(userId);
    const gs = user.gameState!;
    if (!gs.pendingEvent) throw new BadRequestException('No pending event');
    const event = EVENT_DEFS[gs.pendingEvent];
    const choice = event?.choices?.[choiceIndex];
    if (!choice) throw new BadRequestException('Invalid choice');
    if (adProtection) await this.consumeAd(gs);

    const e = choice.effect;
    const ok = e.chance === undefined || Math.random() < e.chance;
    const pct = ok ? (e.cashPct ?? 0) : (e.failCashPct ?? 0);
    let delta = gs.cash * pct + (ok ? (e.cashFlat ?? 0) : 0);
    let rep = ok ? (e.rep ?? 0) : (e.failRep ?? 0);
    if (adProtection) {
      if (delta < 0) delta /= 2;
      if (rep < 0) rep = Math.round(rep / 2);
    }
    await this.prisma.game_state.update({
      where: { userId },
      data: { cash: Math.max(0, gs.cash + delta), reputation: clampRep(gs.reputation + rep), pendingEvent: null, lastEventAt: new Date() },
    });
    const repTxt = rep !== 0 ? ` (${rep > 0 ? '+' : ''}${rep} rep)` : '';
    return this.respond(userId, { success: ok, message: `${ok ? e.result : (e.failResult ?? e.result)}${repTxt}`, amount: delta });
  }

  async claimDaily(userId: number, doubled = false): Promise<ActionResponseDto> {
    const user = await this.settle(userId);
    const gs = user.gameState!;
    const now = new Date();
    const today = dayStr(now);
    const yesterday = dayStr(new Date(now.getTime() - 86400000));
    const last = gs.lastDailyClaim ? dayStr(gs.lastDailyClaim) : null;
    if (last === today) throw new BadRequestException('Already claimed today');
    if (doubled) await this.consumeAd(gs);
    const streak = last === yesterday ? gs.dailyStreak + 1 : 1;
    const reward = DAILY_REWARDS[(streak - 1) % 7];
    const cash = getDailyBaseCash(gs.level) * reward.cashMult * (doubled ? 2 : 1);
    await this.prisma.game_state.update({
      where: { userId },
      data: {
        cash: gs.cash + cash,
        totalEarned: gs.totalEarned + cash,
        bossCoins: gs.bossCoins + reward.coins,
        totalBossCoinsEarned: gs.totalBossCoinsEarned + reward.coins,
        dailyStreak: streak,
        lastDailyClaim: now,
      },
    });
    return this.respond(userId, { message: `Day ${((streak - 1) % 7) + 1} reward claimed!`, amount: cash, bossCoinsAwarded: reward.coins });
  }

  async collectOffline(userId: number, doubled = false): Promise<ActionResponseDto> {
    const user = await this.settle(userId);
    const gs = user.gameState!;
    if (gs.pendingOffline <= 0) throw new BadRequestException('Nothing to collect');
    if (doubled) await this.consumeAd(gs);
    const amount = gs.pendingOffline * (doubled ? 2 : 1);
    await this.prisma.game_state.update({
      where: { userId },
      data: { cash: gs.cash + amount, totalEarned: gs.totalEarned + amount, pendingOffline: 0, pendingOfflineSeconds: 0 },
    });
    return this.respond(userId, { message: 'Offline earnings collected', amount });
  }

  async takeLoan(userId: number, amount: number): Promise<ActionResponseDto> {
    const user = await this.settle(userId);
    const gs = user.gameState!;
    const econ = this.economyFor(user, gs);
    const owed = amount * 1.15;
    const limit = this.creditLimit(gs.level, econ.netWorth + gs.debt);
    if (gs.debt + owed > limit) throw new BadRequestException(`Credit limit is $${limit.toLocaleString()} total debt`);
    await this.prisma.game_state.update({ where: { userId }, data: { cash: gs.cash + amount, debt: gs.debt + owed, reputation: clampRep(gs.reputation - 1) } });
    return this.respond(userId, { message: `Loan approved. You owe $${Math.round(owed).toLocaleString()} (15% fee).`, amount });
  }

  async repayLoan(userId: number, amount: number): Promise<ActionResponseDto> {
    const user = await this.settle(userId);
    const gs = user.gameState!;
    if (gs.debt <= 0) throw new BadRequestException('You have no debt');
    const pay = Math.min(amount, gs.debt, gs.cash);
    if (pay <= 0) throw new BadRequestException('Not enough cash');
    const cleared = gs.debt - pay < 0.01;
    await this.prisma.game_state.update({
      where: { userId },
      data: { cash: gs.cash - pay, debt: cleared ? 0 : gs.debt - pay, reputation: clampRep(gs.reputation + (cleared ? 3 : 0)) },
    });
    return this.respond(userId, { message: cleared ? 'Debt-free! (+3 rep)' : `Paid $${Math.round(pay).toLocaleString()}`, amount: -pay });
  }

  async spendBossCoins(userId: number, itemKey: string, targetBusinessId?: number, newName?: string): Promise<ActionResponseDto> {
    const item = BOSS_COIN_ITEMS[itemKey];
    if (!item) throw new BadRequestException('Invalid item');
    const user = await this.settle(userId);
    const gs = user.gameState!;
    if (gs.bossCoins < item.cost) throw new BadRequestException('Not enough Boss Coins');
    const now = new Date();
    const data: Prisma.game_stateUpdateInput = { bossCoins: gs.bossCoins - item.cost };

    switch (itemKey) {
      case 'energy_refill':
        if (gs.energy >= MAX_ENERGY) throw new BadRequestException('Energy already full');
        data.energy = MAX_ENERGY;
        data.energyUpdatedAt = now;
        break;
      case 'business_rename': {
        if (!targetBusinessId || !newName?.trim()) throw new BadRequestException('Pick a business and a name');
        const biz = user.businesses.find((b) => b.id === targetBusinessId);
        if (!biz) throw new NotFoundException('Business not found');
        await this.prisma.business.update({ where: { id: targetBusinessId }, data: { customName: newName.trim() } });
        break;
      }
      case 'offline_boost':
        if (gs.offlineMaxHours >= 8) throw new BadRequestException('Already upgraded');
        data.offlineMaxHours = 8;
        break;
      case 'xp_booster': {
        const base = gs.xpBoostUntil && gs.xpBoostUntil > now ? gs.xpBoostUntil.getTime() : now.getTime();
        data.xpBoostUntil = new Date(base + 3600000);
        break;
      }
      case 'avatar_frame':
        if (gs.hasAvatarFrame) throw new BadRequestException('Already owned');
        data.hasAvatarFrame = true;
        break;
    }
    await this.prisma.game_state.update({ where: { userId }, data });
    return this.respond(userId, { message: `${item.name} activated`, amount: 0 });
  }

  
async recordAdReward(
  userId: number,
  rewardType: string,
  targetBusinessId?: number,
  opportunityKey?: string,
): Promise<ActionResponseDto> {
  if (rewardType === 'offline_double') return this.collectOffline(userId, true);
  if (rewardType === 'daily_double') return this.claimDaily(userId, true);

  const user = await this.settle(userId);
  const gs = user.gameState!;

  if (rewardType === 'tap_boost') {
    await this.consumeAd(gs);

    const boostUntil = new Date(Date.now() + 5 * 60 * 1000);

    await this.prisma.game_state.update({
      where: { userId },
      data: { tapBoostUntil: boostUntil },
    });

    return this.respond(userId, {
      message: '2x hustle cash and REP activated for 5 minutes!',
    });
  }

  if (rewardType === 'free_research') {
    if (!opportunityKey) throw new BadRequestException('opportunityKey required');
    await this.consumeAd(gs);
    return this.research(userId, opportunityKey, true);
  }

  if (rewardType === 'energy_refill') {
    if (gs.energy >= MAX_ENERGY) throw new BadRequestException('Energy already full');
    await this.consumeAd(gs);
    await this.prisma.game_state.update({
      where: { userId },
      data: { energy: MAX_ENERGY, energyUpdatedAt: new Date() },
    });
    return this.respond(userId, { message: 'Energy refilled!' });
  }

  if (rewardType === 'business_boost') {
    if (!targetBusinessId) throw new BadRequestException('targetBusinessId required');
    const biz = user.businesses.find((b) => b.id === targetBusinessId);
    if (!biz) throw new NotFoundException('Business not found');
    await this.consumeAd(gs);
    await this.prisma.business.update({
      where: { id: biz.id },
      data: { incomeBoostUntil: new Date(Date.now() + 30 * 60000) },
    });
    return this.respond(userId, { message: '2x income for 30 minutes!' });
  }

  throw new BadRequestException('Invalid reward type');
}


  // ---------------------------------------------------------------- achievements

  private async checkAndUpdateAchievements(userId: number): Promise<{ unlocked: string[]; coins: number }> {
    const user = await this.loadUser(userId);
    const gs = user.gameState!;
    const econ = this.economyFor(user, gs);

    // ensure rows exist for newly added achievements
    const have = new Set(user.achievements.map((a) => a.achievementKey));
    const missing = ACHIEVEMENT_KEYS.filter((k) => !have.has(k));
    if (missing.length) {
      await this.prisma.achievement.createMany({ data: missing.map((k) => ({ userId, achievementKey: k })), skipDuplicates: true });
    }
    const achievements = missing.length ? await this.prisma.achievement.findMany({ where: { userId } }) : user.achievements;

    const values: Record<string, number> = {
      totalEarned: gs.totalEarned,
      businessCount: user.businesses.length,
      businessUpgraded: user.businesses.some((b) => b.level >= 2) ? 1 : 0,
      maxBizLevel: user.businesses.reduce((m, b) => Math.max(m, b.level), 0),
      employeeCount: user.businesses.reduce((s, b) => s + b.employees, 0),
      investmentsMade: gs.investmentsMade,
      propertyCount: gs.properties.length,
      vehicleCount: gs.vehicles.length,
      totalHustleTaps: gs.totalHustleTaps,
      netWorth: econ.netWorth,
      level: gs.level,
      reputation: gs.reputation,
      dailyStreak: gs.dailyStreak,
      totalBossCoinsEarned: gs.totalBossCoinsEarned,
    };

    const unlocked: string[] = [];
    let coins = 0;
    for (const ach of achievements) {
      if (ach.completed) continue;
      const def = ACHIEVEMENT_DEFS[ach.achievementKey];
      if (!def) continue;
      const v = values[def.field] ?? 0;
      if (v >= def.target) {
        await this.prisma.achievement.update({ where: { id: ach.id }, data: { progress: def.target, completed: true, completedAt: new Date() } });
        unlocked.push(ach.achievementKey);
        coins += def.reward;
      } else {
        const p = Math.floor(Math.min(v, def.target));
        if (p !== ach.progress) await this.prisma.achievement.update({ where: { id: ach.id }, data: { progress: p } });
      }
    }
    if (coins > 0) {
      await this.prisma.game_state.update({ where: { userId }, data: { bossCoins: { increment: coins }, totalBossCoinsEarned: { increment: coins } } });
    }
    return { unlocked, coins };
  }
}
