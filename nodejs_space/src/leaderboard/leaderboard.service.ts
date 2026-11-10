import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { computeEconomy } from '../constants/game.constants';

function getReputationTitle(rep: number): string {
  if (rep <= 20) return 'Rookie';
  if (rep <= 40) return 'Hustler';
  if (rep <= 60) return 'Entrepreneur';
  if (rep <= 80) return 'Mogul';
  return 'Tycoon';
}

@Injectable()
export class LeaderboardService {
  private readonly logger = new Logger(LeaderboardService.name);

  constructor(private prisma: PrismaService) {}

  async getLeaderboard(userId: number, type: string, limit = 50) {
    const validTypes = ['networth', 'empire', 'investment', 'reputation', 'weekly'];
    if (!validTypes.includes(type)) throw new BadRequestException('Invalid leaderboard type');

    const users = await this.prisma.user.findMany({
      include: { gameState: true, businesses: true, investments: { where: { status: 'active' } } },
    });

    const entries = users
      .filter((u) => u.gameState)
      .map((u) => {
        const gs = u.gameState!;
        const bizes = u.businesses;
        const eco = computeEconomy({
          cash: gs.cash,
          businesses: bizes,
          properties: gs.properties ?? [],
          vehicles: gs.vehicles ?? [],
          debt: gs.debt ?? 0,
          activeInvestmentTotal: (u.investments ?? []).reduce((s, i) => s + i.amount, 0),
        });
        const bizValue = Math.round(eco.businessValue + eco.propertyValue);
        const netWorth = eco.netWorth;

        return {
          userId: u.id,
          playerName: u.playerName,
          avatarEmoji: u.avatarEmoji,
          netWorth,
          level: gs.level,
          empireValue: bizValue,
          businessCount: bizes.length,
          investmentReturns: gs.investmentReturns,
          winRate: gs.investmentWinRate,
          reputation: gs.reputation,
          weeklyGrowth: netWorth - gs.weekStartNetWorth,
          weekStartDate: gs.weekStartDate,
        };
      });

    let sorted: typeof entries;
    switch (type) {
      case 'networth':
        sorted = entries.sort((a, b) => b.netWorth - a.netWorth);
        break;
      case 'empire':
        sorted = entries.sort((a, b) => b.empireValue - a.empireValue);
        break;
      case 'investment':
        sorted = entries.sort((a, b) => b.investmentReturns - a.investmentReturns);
        break;
      case 'reputation':
        sorted = entries.sort((a, b) => b.reputation - a.reputation);
        break;
      case 'weekly': {
        const monday = this.getMondayOfCurrentWeek();
        sorted = entries
          .filter((e) => {
            const ws = new Date(e.weekStartDate);
            return ws.toISOString().slice(0, 10) === monday.toISOString().slice(0, 10);
          })
          .sort((a, b) => b.weeklyGrowth - a.weeklyGrowth);
        break;
      }
      default:
        sorted = entries;
    }

    const ranked = sorted.slice(0, limit).map((e, i) => ({
      rank: i + 1,
      userId: e.userId,
      playerName: e.playerName,
      avatarEmoji: e.avatarEmoji,
      ...(type === 'networth' ? { netWorth: Math.round(e.netWorth * 100) / 100, level: e.level } : {}),
      ...(type === 'empire' ? { empireValue: e.empireValue, businessCount: e.businessCount } : {}),
      ...(type === 'investment' ? { investmentReturns: Math.round(e.investmentReturns * 100) / 100, winRate: Math.round(e.winRate * 10) / 10 } : {}),
      ...(type === 'reputation' ? { reputation: e.reputation, title: getReputationTitle(e.reputation) } : {}),
      ...(type === 'weekly' ? { weeklyGrowth: Math.round(e.weeklyGrowth * 100) / 100 } : {}),
    }));

    // Find user's rank
    const myIdx = sorted.findIndex((e) => e.userId === userId);
    const myRank = myIdx >= 0
      ? {
          rank: myIdx + 1,
          userId: sorted[myIdx].userId,
          playerName: sorted[myIdx].playerName,
          avatarEmoji: sorted[myIdx].avatarEmoji,
          ...(type === 'networth' ? { netWorth: Math.round(sorted[myIdx].netWorth * 100) / 100, level: sorted[myIdx].level } : {}),
          ...(type === 'empire' ? { empireValue: sorted[myIdx].empireValue, businessCount: sorted[myIdx].businessCount } : {}),
          ...(type === 'investment' ? { investmentReturns: Math.round(sorted[myIdx].investmentReturns * 100) / 100, winRate: Math.round(sorted[myIdx].winRate * 10) / 10 } : {}),
          ...(type === 'reputation' ? { reputation: sorted[myIdx].reputation, title: getReputationTitle(sorted[myIdx].reputation) } : {}),
          ...(type === 'weekly' ? { weeklyGrowth: Math.round(sorted[myIdx].weeklyGrowth * 100) / 100 } : {}),
        }
      : null;

    return { entries: ranked, myRank };
  }

  private getMondayOfCurrentWeek(): Date {
    const now = new Date();
    const day = now.getUTCDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(now);
    monday.setUTCDate(now.getUTCDate() + diff);
    monday.setUTCHours(0, 0, 0, 0);
    return monday;
  }
}
