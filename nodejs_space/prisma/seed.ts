import { PrismaClient } from '@prisma/client';
import * as bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

const AVATAR_EMOJIS = ['😎', '🤑', '🦊', '🐺', '🦁', '🎩', '👑', '💪', '🔥', '⚡'];
const DUMMY_NAMES = [
  'BigMoney Mike', 'Cash Queen', 'Street Boss', 'Diamond Dave', 'Gold Digger',
  'Hustle King', 'Money Maker', 'Rich Rita', 'Boss Baby', 'Coin Master',
  'Dollar Dan', 'Empire Eve', 'Fortune Fox', 'Grind Guru', 'Hustle Hero',
  'Income Ivy', 'Jackpot Joe', 'King Cash', 'Lucky Lou', 'Mega Mitch',
  'Noble Nick', 'Profit Pete', 'Queen Bee', 'Rise Ryan', 'Stack Sam',
  'Top Tier Tom', 'Ultra Uma', 'Value Vic', 'Wealth Wendy', 'Xtreme Xander',
];

const ACHIEVEMENT_KEYS = [
  'first_1000', 'first_business', 'upgraded', 'hustler', 'employer', 'investor',
  'landlord', 'wheels', 'level_5', 'level_15', 'empire_5', 'max_level',
  'respected', 'millionaire', 'streak_7', 'boss_coins_earner',
];
const BIZ_LADDER = ['lemonade_stand', 'car_wash', 'food_truck', 'barbershop', 'restaurant', 'nightclub', 'hotel', 'tech_hq'];
const PROP_LADDER = ['duplex', 'apartment_block', 'loft_tower', 'skyscraper'];
const VEH_LADDER = ['sedan', 'van', 'supercar'];
function botAssets(level: number) {
  const bizCount = Math.min(BIZ_LADDER.length, Math.max(1, Math.floor(level / 3)));
  const businesses = BIZ_LADDER.slice(0, bizCount).map((t) => ({
    businessType: t, level: randInt(1, Math.min(10, 1 + Math.floor(level / 3))), employees: randInt(0, Math.min(5, Math.floor(level / 4))),
  }));
  const properties = PROP_LADDER.slice(0, Math.min(PROP_LADDER.length, Math.floor(level / 6)));
  const vehicles = VEH_LADDER.slice(0, Math.min(VEH_LADDER.length, Math.floor(level / 7)));
  return { businesses, properties, vehicles };
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function getMondayOfCurrentWeek(): Date {
  const now = new Date();
  const day = now.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setUTCDate(now.getUTCDate() + diff);
  monday.setUTCHours(0, 0, 0, 0);
  return monday;
}

async function main() {
  const passwordHash = await bcryptjs.hash('dummypassword', 10);

  // Seed hidden test admin
  const adminEmail = 'abacus-4731976b@example.com';
  const adminPwHash = await bcryptjs.hash('5Y*k8sb5Ae', 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: adminPwHash,
      name: 'Admin',
      playerName: 'Admin',
      avatarEmoji: '👑',
      gameState: {
        create: {
          cash: 50,
          bossCoins: 50,
          level: 1,
          xp: 0,
          totalBossCoinsEarned: 50,
          weekStartDate: getMondayOfCurrentWeek(),
        },
      },
      achievements: {
        create: ACHIEVEMENT_KEYS.map((key) => ({ achievementKey: key })),
      },
    },
  });

  // Seed 30 dummy users
  const monday = getMondayOfCurrentWeek();
  for (let i = 0; i < 30; i++) {
    const email = `bot${i + 1}@bumtoboss.game`;
    const playerName = DUMMY_NAMES[i];
    const avatarEmoji = AVATAR_EMOJIS[randInt(0, AVATAR_EMOJIS.length - 1)];
    const level = randInt(1, 25);
    const cash = randFloat(100, 5000000);
    const totalEarned = cash * randFloat(1.5, 5.0);
    const reputation = randInt(10, 95);
    const bossCoins = randInt(0, 200);
    const totalBossCoinsEarned = bossCoins + randInt(50, 300);
    const xpThreshold = Math.floor(100 * Math.pow(1.5, level - 1));
    const xp = randInt(0, xpThreshold);
    const investmentReturns = randFloat(0, 50000);
    const investmentWinRate = randFloat(30, 90);

    const netWorth = cash;
    const weekStartNetWorth = netWorth * randFloat(0.7, 0.95);

    const lastActiveAt = new Date(Date.now() - randInt(0, 86400000));

    const assets = botAssets(level);
    const existing = await prisma.user.findUnique({ where: { email }, include: { gameState: true } });
    if (existing) {
      const a = botAssets(existing.gameState?.level ?? level);
      for (const b of a.businesses) {
        await prisma.business.upsert({
          where: { userId_businessType: { userId: existing.id, businessType: b.businessType } },
          update: { level: b.level, employees: b.employees },
          create: { ...b, userId: existing.id },
        });
      }
      await prisma.game_state.update({ where: { userId: existing.id }, data: { properties: a.properties, vehicles: a.vehicles } });
      for (const key of ACHIEVEMENT_KEYS) {
        await prisma.achievement.upsert({
          where: { userId_achievementKey: { userId: existing.id, achievementKey: key } },
          update: {},
          create: { userId: existing.id, achievementKey: key },
        });
      }
      continue;
    }

    await prisma.user.create({
      data: {
        email,
        password: passwordHash,
        name: playerName,
        playerName,
        avatarEmoji,
        gameState: {
          create: {
            cash,
            xp,
            level,
            bossCoins,
            totalEarned,
            totalHustleTaps: randInt(0, 500),
            totalBossCoinsEarned,
            reputation,
            investmentReturns,
            investmentWinRate,
            weekStartNetWorth,
            weekStartDate: monday,
            lastActiveAt,
            offlineMaxHours: 4,
            properties: assets.properties,
            vehicles: assets.vehicles,
          },
        },
        businesses: { create: assets.businesses },
        achievements: {
          create: ACHIEVEMENT_KEYS.map((key) => {
            const completed = Math.random() < 0.3;
            return {
              achievementKey: key,
              progress: completed ? 999 : randInt(0, 30),
              completed,
              completedAt: completed ? new Date() : null,
            };
          }),
        },
      },
    });
  }

  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
