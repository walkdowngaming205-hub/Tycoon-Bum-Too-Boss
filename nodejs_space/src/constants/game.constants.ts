// ================= RANKS =================
export const RANKS: { key: string; title: string; minNetWorth: number }[] = [
  { key: 'bum', title: 'Bum', minNetWorth: 0 },
  { key: 'hustler', title: 'Hustler', minNetWorth: 1_000 },
  { key: 'entrepreneur', title: 'Entrepreneur', minNetWorth: 10_000 },
  { key: 'business_owner', title: 'Business Owner', minNetWorth: 100_000 },
  { key: 'ceo', title: 'CEO', minNetWorth: 1_000_000 },
  { key: 'mogul', title: 'Mogul', minNetWorth: 10_000_000 },
  { key: 'boss', title: 'Boss', minNetWorth: 100_000_000 },
  { key: 'empire_owner', title: 'Empire Owner', minNetWorth: 1_000_000_000 },
];

export function getRankIndex(netWorth: number): number {
  let idx = 0;
  RANKS.forEach((r, i) => {
    if (netWorth >= r.minNetWorth) idx = i;
  });
  return idx;
}

// ================= DISTRICTS =================
export const DISTRICT_DEFS: Record<string, { name: string; minNetWorth: number; minReputation: number; order: number }> = {
  neighborhood: { name: 'The Block', minNetWorth: 0, minReputation: 0, order: 0 },
  downtown: { name: 'Downtown', minNetWorth: 25_000, minReputation: 20, order: 1 },
  business: { name: 'Business District', minNetWorth: 250_000, minReputation: 35, order: 2 },
  luxury: { name: 'Luxury Row', minNetWorth: 2_500_000, minReputation: 50, order: 3 },
  financial: { name: 'Financial Center', minNetWorth: 25_000_000, minReputation: 65, order: 4 },
};

// ================= HUSTLES =================
export const MAX_ENERGY = 100;
export const ENERGY_REGEN_SECONDS = 20;

export const HUSTLE_DEFS: Record<
  string,
  { name: string; reward: number; xp: number; cooldown: number; unlockLevel: number; energy: number; successRate: number; failLoss: number; rep: number }
> = {
  wash_cars: { name: 'Wash Cars', reward: 8, xp: 2, cooldown: 2, unlockLevel: 1, energy: 4, successRate: 1, failLoss: 0, rep: 0 },
  lawn_care: { name: 'Lawn Care', reward: 22, xp: 4, cooldown: 4, unlockLevel: 2, energy: 6, successRate: 1, failLoss: 0, rep: 0 },
  deliver_food: { name: 'Food Delivery', reward: 50, xp: 7, cooldown: 6, unlockLevel: 3, energy: 8, successRate: 1, failLoss: 0, rep: 0 },
  cleaning: { name: 'House Cleaning', reward: 110, xp: 10, cooldown: 8, unlockLevel: 5, energy: 10, successRate: 1, failLoss: 0, rep: 1 },
  moving: { name: 'Moving Crew', reward: 260, xp: 15, cooldown: 12, unlockLevel: 7, energy: 15, successRate: 1, failLoss: 0, rep: 1 },
  sneaker_resell: { name: 'Sneaker Flip', reward: 900, xp: 20, cooldown: 15, unlockLevel: 9, energy: 12, successRate: 0.65, failLoss: 300, rep: 0 },
  phone_repair: { name: 'Phone Repair', reward: 1400, xp: 25, cooldown: 15, unlockLevel: 12, energy: 14, successRate: 0.9, failLoss: 200, rep: 1 },
  food_stand: { name: 'Street Food Stand', reward: 3200, xp: 35, cooldown: 20, unlockLevel: 15, energy: 16, successRate: 1, failLoss: 0, rep: 1 },
  clothing_resell: { name: 'Designer Resale', reward: 9000, xp: 50, cooldown: 25, unlockLevel: 18, energy: 18, successRate: 0.6, failLoss: 3000, rep: 0 },
};
export const HUSTLE_KEYS = Object.keys(HUSTLE_DEFS);

// ================= BUSINESSES =================
export const MAX_BUSINESS_LEVEL = 10;
export const MAX_EMPLOYEES = 5;

export const BUSINESS_DEFS: Record<
  string,
  { name: string; cost: number; baseIncomePerSecond: number; expenseRate: number; district: string; unlockLevel: number; minReputation: number; repGain: number }
> = {
  lemonade_stand: { name: 'Lemonade Stand', cost: 50, baseIncomePerSecond: 0.5, expenseRate: 0.1, district: 'neighborhood', unlockLevel: 1, minReputation: 0, repGain: 1 },
  car_wash: { name: 'Sparkle Car Wash', cost: 600, baseIncomePerSecond: 4, expenseRate: 0.2, district: 'neighborhood', unlockLevel: 2, minReputation: 0, repGain: 2 },
  food_truck: { name: 'Street Eats Truck', cost: 3_000, baseIncomePerSecond: 18, expenseRate: 0.25, district: 'neighborhood', unlockLevel: 4, minReputation: 10, repGain: 2 },
  barbershop: { name: 'Fresh Cuts Barbershop', cost: 12_000, baseIncomePerSecond: 60, expenseRate: 0.25, district: 'neighborhood', unlockLevel: 6, minReputation: 15, repGain: 3 },
  restaurant: { name: 'Uptown Bistro', cost: 75_000, baseIncomePerSecond: 320, expenseRate: 0.35, district: 'downtown', unlockLevel: 9, minReputation: 20, repGain: 4 },
  nightclub: { name: 'Neon Nights Club', cost: 400_000, baseIncomePerSecond: 1_600, expenseRate: 0.35, district: 'business', unlockLevel: 13, minReputation: 35, repGain: 5 },
  hotel: { name: 'Grand Boss Hotel', cost: 2_800_000, baseIncomePerSecond: 9_500, expenseRate: 0.4, district: 'luxury', unlockLevel: 17, minReputation: 50, repGain: 6 },
  tech_hq: { name: 'BossTech HQ', cost: 30_000_000, baseIncomePerSecond: 85_000, expenseRate: 0.4, district: 'financial', unlockLevel: 22, minReputation: 65, repGain: 8 },
};
export const BUSINESS_KEYS = Object.keys(BUSINESS_DEFS);

export function getUpgradeCost(businessType: string, level: number): number {
  const def = BUSINESS_DEFS[businessType];
  if (!def) return 0;
  return Math.round(def.cost * 0.6 * Math.pow(1.55, level - 1));
}

export function getHireCost(businessType: string, employees: number): number {
  const def = BUSINESS_DEFS[businessType];
  if (!def) return 0;
  return Math.round(def.cost * 0.35 * Math.pow(1.6, employees));
}

/** Gross revenue per second for a business (before expenses). */
export function getBusinessGross(businessType: string, level: number, employees: number): number {
  const def = BUSINESS_DEFS[businessType];
  if (!def) return 0;
  return def.baseIncomePerSecond * level * Math.pow(1.18, level - 1) * (1 + employees * 0.2);
}

/** Net income per second (gross - expenses), with boost + global multiplier. */
export function getBusinessIncomePerSecond(businessType: string, level: number, isBoosted: boolean, employees = 0, globalMult = 1): number {
  const def = BUSINESS_DEFS[businessType];
  if (!def) return 0;
  const net = getBusinessGross(businessType, level, employees) * (1 - def.expenseRate);
  return net * (isBoosted ? 2 : 1) * globalMult;
}

/** Value of a business for net-worth purposes (purchase + upgrades invested). */
export function getBusinessValue(businessType: string, level: number, employees: number): number {
  const def = BUSINESS_DEFS[businessType];
  if (!def) return 0;
  let v = def.cost;
  for (let l = 1; l < level; l++) v += getUpgradeCost(businessType, l);
  for (let e = 0; e < employees; e++) v += getHireCost(businessType, e) * 0.5;
  return v;
}

// ================= PROPERTIES =================
export const PROPERTY_DEFS: Record<string, { name: string; cost: number; rentPerSecond: number; district: string; rep: number }> = {
  duplex: { name: 'Corner Duplex', cost: 8_000, rentPerSecond: 12, district: 'neighborhood', rep: 2 },
  apartment_block: { name: 'Apartment Block', cost: 90_000, rentPerSecond: 120, district: 'downtown', rep: 4 },
  loft_tower: { name: 'Downtown Lofts', cost: 900_000, rentPerSecond: 1_100, district: 'business', rep: 6 },
  skyscraper: { name: 'Boss Tower', cost: 40_000_000, rentPerSecond: 45_000, district: 'financial', rep: 12 },
};

// ================= VEHICLES =================
export const VEHICLE_DEFS: Record<string, { name: string; cost: number; incomeBonus: number; hustleBonus: number; district: string; rep: number }> = {
  sedan: { name: 'Used Sedan', cost: 2_500, incomeBonus: 0.03, hustleBonus: 0.25, district: 'neighborhood', rep: 2 },
  van: { name: 'Work Van', cost: 35_000, incomeBonus: 0.08, hustleBonus: 0.5, district: 'downtown', rep: 3 },
  supercar: { name: 'Gold Supercar', cost: 3_500_000, incomeBonus: 0.2, hustleBonus: 1, district: 'luxury', rep: 15 },
};

// ================= INVESTMENTS =================
export const INVESTMENT_DEFS: Record<
  string,
  { name: string; risk: 'low' | 'medium' | 'high' | 'extreme'; minutes: number; minMult: number; maxMult: number; baseWin: number; minLevel: number }
> = {
  blue_chip: { name: 'Blue Chip Stocks', risk: 'low', minutes: 3, minMult: 0.9, maxMult: 1.35, baseWin: 0.75, minLevel: 3 },
  real_estate_fund: { name: 'Real Estate Fund', risk: 'low', minutes: 8, minMult: 0.95, maxMult: 1.5, baseWin: 0.8, minLevel: 5 },
  gold_bullion: { name: 'Gold Bullion', risk: 'medium', minutes: 5, minMult: 0.75, maxMult: 1.8, baseWin: 0.6, minLevel: 4 },
  penny_stock: { name: 'Penny Stock', risk: 'high', minutes: 4, minMult: 0.1, maxMult: 3.5, baseWin: 0.45, minLevel: 3 },
  startup_angel: { name: 'Startup Angel Round', risk: 'high', minutes: 12, minMult: 0, maxMult: 6, baseWin: 0.4, minLevel: 8 },
  crypto_coin: { name: 'MoonCoin Crypto', risk: 'extreme', minutes: 6, minMult: 0, maxMult: 10, baseWin: 0.3, minLevel: 6 },
};

export const SENTIMENTS = ['bearish', 'neutral', 'bullish'] as const;
export const SENTIMENT_WIN_SHIFT: Record<string, number> = { bearish: -0.25, neutral: 0, bullish: 0.25 };

export function getResearchCost(level: number): number {
  return Math.round(50 * Math.pow(1.45, level - 1));
}

/** Deterministic hidden market sentiment per user+opportunity per 30-min window. */
export function getSentiment(userId: number, key: string, bucket: number): string {
  let h = 2166136261;
  const s = `${userId}:${key}:${bucket}`;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return SENTIMENTS[Math.abs(h) % 3];
}

export function currentBucket(): number {
  return Math.floor(Date.now() / (30 * 60 * 1000));
}

// ================= EVENTS =================
export type EventEffect = { cashPct?: number; cashFlat?: number; rep?: number; chance?: number; failCashPct?: number; failRep?: number; result: string; failResult?: string };
export const EVENT_DEFS: Record<string, { title: string; description: string; choices: { label: string; effect: EventEffect }[] }> = {
  health_inspection: {
    title: 'Surprise Health Inspection',
    description: 'An inspector shows up at one of your spots. Things are... not spotless.',
    choices: [
      { label: 'Pay for a deep clean', effect: { cashPct: -0.06, rep: 3, result: 'Spotless. The inspector is impressed.' } },
      { label: 'Charm your way through', effect: { chance: 0.5, rep: 2, failCashPct: -0.12, failRep: -6, result: 'Smooth talker! You passed.', failResult: 'Busted. Big fine and bad press.' } },
      { label: 'Close for the day', effect: { cashPct: -0.03, rep: -1, result: 'Lost a day of sales, but no fine.' } },
    ],
  },
  viral_review: {
    title: 'Going Viral',
    description: 'An influencer posted about your business. Crowds are forming!',
    choices: [
      { label: 'Run a promo to ride the wave', effect: { cashPct: -0.04, rep: 8, result: 'The promo explodes. Reputation soars!' } },
      { label: 'Raise prices', effect: { cashPct: 0.1, rep: -3, result: 'Cha-ching. Some fans call you greedy.' } },
      { label: 'Do nothing', effect: { rep: 2, result: 'The buzz fades but people remember you.' } },
    ],
  },
  employee_strike: {
    title: 'Staff Walkout',
    description: 'Your employees want better pay or they are walking.',
    choices: [
      { label: 'Give raises', effect: { cashPct: -0.08, rep: 5, result: 'Happy team, happy customers.' } },
      { label: 'Negotiate', effect: { chance: 0.6, rep: 2, failCashPct: -0.1, failRep: -3, result: 'Deal reached at a fair price.', failResult: 'Talks failed. Expensive temp workers.' } },
      { label: 'Replace them', effect: { cashPct: -0.05, rep: -6, result: 'New crew hired. Word gets around.' } },
    ],
  },
  shady_deal: {
    title: 'A Shady Offer',
    description: 'A guy in a parking lot offers you "discount inventory". No questions asked.',
    choices: [
      { label: 'Take the deal', effect: { chance: 0.45, cashPct: 0.15, rep: -4, failCashPct: -0.15, failRep: -10, result: 'Big margins this week. Risky though.', failResult: 'Stolen goods. Cops seized everything.' } },
      { label: 'Walk away', effect: { rep: 2, result: 'You keep your hands clean.' } },
      { label: 'Report him', effect: { rep: 5, cashFlat: 100, result: 'Reward from the city + good rep.' } },
    ],
  },
  equipment_breakdown: {
    title: 'Equipment Breakdown',
    description: 'Major equipment failed in the middle of a rush.',
    choices: [
      { label: 'Buy brand new', effect: { cashPct: -0.1, rep: 3, result: 'Shiny new gear. Customers notice.' } },
      { label: 'Repair it yourself', effect: { chance: 0.55, cashPct: -0.02, failCashPct: -0.12, failRep: -2, result: 'Good as new. Cheap fix!', failResult: 'Made it worse. Full replacement needed.' } },
      { label: 'Buy used', effect: { cashPct: -0.05, result: 'It works. Mostly.' } },
    ],
  },
  rival_offer: {
    title: 'Rival Wants In',
    description: 'A rival tycoon offers a partnership on a city contract.',
    choices: [
      { label: 'Partner up', effect: { chance: 0.6, cashPct: 0.12, rep: 3, failCashPct: -0.08, failRep: -2, result: 'Contract won. Split the profits.', failResult: 'They double-crossed you.' } },
      { label: 'Bid alone', effect: { chance: 0.35, cashPct: 0.25, rep: 5, failCashPct: -0.05, result: 'You won it solo. Huge payday!', failResult: 'Lost the bid and the prep costs.' } },
      { label: 'Decline', effect: { result: 'You stay focused on your own empire.' } },
    ],
  },
  charity_gala: {
    title: 'Charity Gala Invite',
    description: 'The city\'s elite are hosting a charity gala. Donations are expected.',
    choices: [
      { label: 'Donate big', effect: { cashPct: -0.07, rep: 10, result: 'Your name is on the plaque. Respect.' } },
      { label: 'Donate small', effect: { cashPct: -0.02, rep: 3, result: 'A polite round of applause.' } },
      { label: 'Skip it', effect: { rep: -2, result: 'People noticed you weren\'t there.' } },
    ],
  },
  tax_audit: {
    title: 'Tax Audit',
    description: 'The IRS wants to see your books.',
    choices: [
      { label: 'Hire a top accountant', effect: { cashPct: -0.05, rep: 1, result: 'Clean books. Audit closed.' } },
      { label: 'Handle it yourself', effect: { chance: 0.5, failCashPct: -0.15, failRep: -4, result: 'You nailed it. Zero penalties.', failResult: 'Missed deductions + penalties.' } },
    ],
  },
};
export const EVENT_KEYS = Object.keys(EVENT_DEFS);
export const EVENT_MIN_INTERVAL_SECONDS = 240;
export const EVENT_CHANCE = 0.35;

// ================= DAILY REWARDS =================
export const DAILY_REWARDS: { cashMult: number; coins: number }[] = [
  { cashMult: 1, coins: 0 },
  { cashMult: 1.5, coins: 0 },
  { cashMult: 2, coins: 10 },
  { cashMult: 2.5, coins: 0 },
  { cashMult: 3, coins: 15 },
  { cashMult: 4, coins: 0 },
  { cashMult: 6, coins: 50 },
];
export function getDailyBaseCash(level: number): number {
  return Math.round(100 * Math.pow(1.4, level - 1));
}

// ================= ACHIEVEMENTS =================
export const ACHIEVEMENT_DEFS: Record<string, { title: string; description: string; target: number; field: string; reward: number }> = {
  first_1000: { title: 'First $1,000', description: 'Earn $1,000 total', target: 1000, field: 'totalEarned', reward: 10 },
  first_business: { title: 'First Business', description: 'Buy your first business', target: 1, field: 'businessCount', reward: 15 },
  upgraded: { title: 'Upgraded!', description: 'Upgrade a business to Level 2', target: 1, field: 'businessUpgraded', reward: 10 },
  hustler: { title: 'Hustler', description: 'Complete 50 hustles', target: 50, field: 'totalHustleTaps', reward: 20 },
  employer: { title: 'Employer', description: 'Hire your first employee', target: 1, field: 'employeeCount', reward: 20 },
  investor: { title: 'Investor', description: 'Make your first investment', target: 1, field: 'investmentsMade', reward: 25 },
  landlord: { title: 'Landlord', description: 'Buy your first property', target: 1, field: 'propertyCount', reward: 25 },
  wheels: { title: 'New Wheels', description: 'Buy your first vehicle', target: 1, field: 'vehicleCount', reward: 15 },
  level_5: { title: 'Level 5', description: 'Reach Level 5', target: 5, field: 'level', reward: 15 },
  level_15: { title: 'Level 15', description: 'Reach Level 15', target: 15, field: 'level', reward: 40 },
  empire_5: { title: 'Chain Owner', description: 'Own 5 businesses', target: 5, field: 'businessCount', reward: 40 },
  max_level: { title: 'Maxed Out', description: 'Upgrade a business to Level 10', target: 10, field: 'maxBizLevel', reward: 50 },
  respected: { title: 'Respected', description: 'Reach 60 reputation', target: 60, field: 'reputation', reward: 30 },
  millionaire: { title: 'Millionaire', description: 'Reach $1M net worth', target: 1_000_000, field: 'netWorth', reward: 50 },
  streak_7: { title: 'Dedicated', description: 'Reach a 7-day login streak', target: 7, field: 'dailyStreak', reward: 30 },
  boss_coins_earner: { title: 'Coin Collector', description: 'Earn 100 Boss Coins total', target: 100, field: 'totalBossCoinsEarned', reward: 25 },
};
export const ACHIEVEMENT_KEYS = Object.keys(ACHIEVEMENT_DEFS);

// ================= BOSS COIN STORE (convenience/cosmetic only) =================
export const BOSS_COIN_ITEMS: Record<string, { name: string; description: string; cost: number }> = {
  energy_refill: { name: 'Energy Drink', description: 'Refill energy to full', cost: 10 },
  business_rename: { name: 'Rename Business', description: 'Give a business a custom name', cost: 10 },
  offline_boost: { name: 'Night Manager', description: 'Extend offline earnings to 8 hours', cost: 40 },
  xp_booster: { name: 'XP Booster (1h)', description: '2x XP for 1 hour', cost: 20 },
  avatar_frame: { name: 'Gold Avatar Frame', description: 'A premium gold frame for your avatar', cost: 50 },
};

export function xpThresholdForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

// ================= ECONOMY SNAPSHOT =================
export interface EconomyInput {
  cash: number;
  debt: number;
  properties: string[];
  vehicles: string[];
  businesses: { businessType: string; level: number; employees: number; incomeBoostUntil: Date | null }[];
  activeInvestmentTotal: number;
}

export function computeEconomy(input: EconomyInput, at: Date = new Date()) {
  const vehicleIncomeBonus = (input.vehicles ?? []).reduce((s, v) => s + (VEHICLE_DEFS[v]?.incomeBonus ?? 0), 0);
  const hustleBonus = (input.vehicles ?? []).reduce((s, v) => s + (VEHICLE_DEFS[v]?.hustleBonus ?? 0), 0);
  const globalMult = 1 + vehicleIncomeBonus;
  let businessIncome = 0;
  let businessValue = 0;
  for (const b of input.businesses ?? []) {
    const boosted = b.incomeBoostUntil ? b.incomeBoostUntil > at : false;
    businessIncome += getBusinessIncomePerSecond(b.businessType, b.level, boosted, b.employees, globalMult);
    businessValue += getBusinessValue(b.businessType, b.level, b.employees);
  }
  const rentIncome = (input.properties ?? []).reduce((s, p) => s + (PROPERTY_DEFS[p]?.rentPerSecond ?? 0), 0);
  const propertyValue = (input.properties ?? []).reduce((s, p) => s + (PROPERTY_DEFS[p]?.cost ?? 0), 0);
  const vehicleValue = (input.vehicles ?? []).reduce((s, v) => s + (VEHICLE_DEFS[v]?.cost ?? 0) * 0.6, 0);
  const netWorth = input.cash + businessValue + propertyValue + vehicleValue + input.activeInvestmentTotal - input.debt;
  return {
    globalMult,
    hustleBonus,
    businessIncome,
    rentIncome,
    passiveIncomePerSecond: businessIncome + rentIncome,
    businessValue,
    propertyValue,
    vehicleValue,
    netWorth,
  };
}

export function isDistrictUnlocked(district: string, netWorth: number, reputation: number): boolean {
  const d = DISTRICT_DEFS[district];
  if (!d) return false;
  return netWorth >= d.minNetWorth && reputation >= d.minReputation;
}
