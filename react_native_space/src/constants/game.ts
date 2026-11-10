import type { ImageSourcePropType } from 'react-native';

export const IMAGES: Record<string, ImageSourcePropType> = {
  biz_food_truck: require('../../assets/images/biz_food_truck.jpg'),
  biz_car_wash: require('../../assets/images/biz_car_wash.jpg'),
  biz_barbershop: require('../../assets/images/biz_barbershop.jpg'),
  biz_restaurant: require('../../assets/images/biz_restaurant.jpg'),
  biz_nightclub: require('../../assets/images/biz_nightclub.jpg'),
  biz_hotel: require('../../assets/images/biz_hotel.jpg'),
  biz_tech_hq: require('../../assets/images/biz_tech_hq.jpg'),
  prop_duplex: require('../../assets/images/prop_duplex.jpg'),
  prop_skyscraper: require('../../assets/images/prop_skyscraper.jpg'),
  veh_sedan: require('../../assets/images/veh_sedan.jpg'),
  veh_van: require('../../assets/images/veh_van.jpg'),
  veh_supercar: require('../../assets/images/veh_supercar.jpg'),
  district_block: require('../../assets/images/district_block.jpg'),
  district_downtown: require('../../assets/images/district_downtown.jpg'),
  district_skyline: require('../../assets/images/district_skyline.jpg'),
};

export const RANKS = [
  { title: 'Bum', minNetWorth: 0, icon: '🥫' },
  { title: 'Hustler', minNetWorth: 1_000, icon: '🧢' },
  { title: 'Entrepreneur', minNetWorth: 10_000, icon: '💼' },
  { title: 'Business Owner', minNetWorth: 100_000, icon: '🏪' },
  { title: 'CEO', minNetWorth: 1_000_000, icon: '👔' },
  { title: 'Mogul', minNetWorth: 10_000_000, icon: '🏙️' },
  { title: 'Boss', minNetWorth: 100_000_000, icon: '👑' },
  { title: 'Empire Owner', minNetWorth: 1_000_000_000, icon: '🏰' },
];

export interface DistrictDef { key: string; name: string; minNetWorth: number; minReputation: number; image: string; tagline: string }
export const DISTRICTS: DistrictDef[] = [
  { key: 'neighborhood', name: 'The Block', minNetWorth: 0, minReputation: 0, image: 'district_block', tagline: 'Where every boss starts' },
  { key: 'downtown', name: 'Downtown', minNetWorth: 25_000, minReputation: 20, image: 'district_downtown', tagline: 'Neon streets, bigger deals' },
  { key: 'business', name: 'Business District', minNetWorth: 250_000, minReputation: 35, image: 'district_skyline', tagline: 'Glass towers & nightlife' },
  { key: 'luxury', name: 'Luxury Row', minNetWorth: 2_500_000, minReputation: 50, image: 'district_skyline', tagline: 'Five-star living' },
  { key: 'financial', name: 'Financial Center', minNetWorth: 25_000_000, minReputation: 65, image: 'district_skyline', tagline: 'Where empires are traded' },
];
export const DISTRICT_MAP: Record<string, DistrictDef> = Object.fromEntries(DISTRICTS.map((d) => [d.key, d]));

export interface HustleDef { key: string; name: string; icon: string; reward: number; xp: number; unlockLevel: number; energy: number; successRate?: number; failLoss?: number }
export const HUSTLES: HustleDef[] = [
  { key: 'wash_cars', name: 'Wash Cars', icon: 'water', reward: 8, xp: 2, unlockLevel: 1, energy: 4 },
  { key: 'lawn_care', name: 'Lawn Care', icon: 'leaf', reward: 22, xp: 4, unlockLevel: 2, energy: 6 },
  { key: 'deliver_food', name: 'Food Delivery', icon: 'bicycle', reward: 50, xp: 7, unlockLevel: 3, energy: 8 },
  { key: 'cleaning', name: 'House Cleaning', icon: 'sparkles', reward: 110, xp: 10, unlockLevel: 5, energy: 10 },
  { key: 'moving', name: 'Moving Crew', icon: 'cube', reward: 260, xp: 15, unlockLevel: 7, energy: 15 },
  { key: 'sneaker_resell', name: 'Sneaker Flip', icon: 'footsteps', reward: 900, xp: 20, unlockLevel: 9, energy: 12, successRate: 0.65, failLoss: 300 },
  { key: 'phone_repair', name: 'Phone Repair', icon: 'phone-portrait', reward: 1400, xp: 25, unlockLevel: 12, energy: 14, successRate: 0.9, failLoss: 200 },
  { key: 'food_stand', name: 'Street Food Stand', icon: 'fast-food', reward: 3200, xp: 35, unlockLevel: 15, energy: 16 },
  { key: 'clothing_resell', name: 'Designer Resale', icon: 'shirt', reward: 9000, xp: 50, unlockLevel: 18, energy: 18, successRate: 0.6, failLoss: 3000 },
];

export interface BusinessDef { key: string; name: string; cost: number; baseIncome: number; district: string; unlockLevel: number; minReputation: number; image: string }
export const BUSINESSES: BusinessDef[] = [
  { key: 'lemonade_stand', name: 'Lemonade Stand', cost: 50, baseIncome: 0.5, district: 'neighborhood', unlockLevel: 1, minReputation: 0, image: 'biz_food_truck' },
  { key: 'car_wash', name: 'Sparkle Car Wash', cost: 600, baseIncome: 4, district: 'neighborhood', unlockLevel: 2, minReputation: 0, image: 'biz_car_wash' },
  { key: 'food_truck', name: 'Street Eats Truck', cost: 3_000, baseIncome: 18, district: 'neighborhood', unlockLevel: 4, minReputation: 10, image: 'biz_food_truck' },
  { key: 'barbershop', name: 'Fresh Cuts Barbershop', cost: 12_000, baseIncome: 60, district: 'neighborhood', unlockLevel: 6, minReputation: 15, image: 'biz_barbershop' },
  { key: 'restaurant', name: 'Uptown Bistro', cost: 75_000, baseIncome: 320, district: 'downtown', unlockLevel: 9, minReputation: 20, image: 'biz_restaurant' },
  { key: 'nightclub', name: 'Neon Nights Club', cost: 400_000, baseIncome: 1_600, district: 'business', unlockLevel: 13, minReputation: 35, image: 'biz_nightclub' },
  { key: 'hotel', name: 'Grand Boss Hotel', cost: 2_800_000, baseIncome: 9_500, district: 'luxury', unlockLevel: 17, minReputation: 50, image: 'biz_hotel' },
  { key: 'tech_hq', name: 'BossTech HQ', cost: 30_000_000, baseIncome: 85_000, district: 'financial', unlockLevel: 22, minReputation: 65, image: 'biz_tech_hq' },
];
export const BUSINESS_MAP: Record<string, BusinessDef> = Object.fromEntries(BUSINESSES.map((b) => [b.key, b]));
export const MAX_BUSINESS_LEVEL = 10;
export const MAX_EMPLOYEES = 5;

export interface PropertyDef { key: string; name: string; cost: number; rent: number; district: string; image: string }
export const PROPERTIES: PropertyDef[] = [
  { key: 'duplex', name: 'Corner Duplex', cost: 8_000, rent: 12, district: 'neighborhood', image: 'prop_duplex' },
  { key: 'apartment_block', name: 'Apartment Block', cost: 90_000, rent: 120, district: 'downtown', image: 'prop_duplex' },
  { key: 'loft_tower', name: 'Downtown Lofts', cost: 900_000, rent: 1_100, district: 'business', image: 'prop_skyscraper' },
  { key: 'skyscraper', name: 'Boss Tower', cost: 40_000_000, rent: 45_000, district: 'financial', image: 'prop_skyscraper' },
];

export interface VehicleDef { key: string; name: string; cost: number; incomeBonus: number; hustleBonus: number; district: string; image: string }
export const VEHICLES: VehicleDef[] = [
  { key: 'sedan', name: 'Used Sedan', cost: 2_500, incomeBonus: 0.03, hustleBonus: 0.25, district: 'neighborhood', image: 'veh_sedan' },
  { key: 'van', name: 'Work Van', cost: 35_000, incomeBonus: 0.08, hustleBonus: 0.5, district: 'downtown', image: 'veh_van' },
  { key: 'supercar', name: 'Gold Supercar', cost: 3_500_000, incomeBonus: 0.2, hustleBonus: 1, district: 'luxury', image: 'veh_supercar' },
];

export type Risk = 'low' | 'medium' | 'high' | 'extreme';
export interface InvestmentDef { key: string; name: string; icon: string; risk: Risk; durationMin: number; minMult: number; maxMult: number; winRate: number; minLevel: number; blurb: string }
export const INVESTMENTS: InvestmentDef[] = [
  { key: 'blue_chip', name: 'Blue Chip Stocks', icon: 'trending-up', risk: 'low', durationMin: 3, minMult: 0.9, maxMult: 1.35, winRate: 0.75, minLevel: 3, blurb: 'Steady giants. Slow and safe.' },
  { key: 'gold_bullion', name: 'Gold Bullion', icon: 'diamond', risk: 'medium', durationMin: 5, minMult: 0.75, maxMult: 1.8, winRate: 0.6, minLevel: 4, blurb: 'Classic hedge against chaos.' },
  { key: 'real_estate_fund', name: 'Real Estate Fund', icon: 'business', risk: 'low', durationMin: 8, minMult: 0.95, maxMult: 1.5, winRate: 0.8, minLevel: 5, blurb: 'Bricks, rent, reliable returns.' },
  { key: 'penny_stock', name: 'Penny Stock', icon: 'flash', risk: 'high', durationMin: 4, minMult: 0.1, maxMult: 3.5, winRate: 0.45, minLevel: 3, blurb: 'Cheap shares, wild swings.' },
  { key: 'crypto_coin', name: 'MoonCoin Crypto', icon: 'rocket', risk: 'extreme', durationMin: 6, minMult: 0, maxMult: 10, winRate: 0.3, minLevel: 6, blurb: 'To the moon… or zero.' },
  { key: 'startup_angel', name: 'Startup Angel Round', icon: 'bulb', risk: 'high', durationMin: 12, minMult: 0, maxMult: 6, winRate: 0.4, minLevel: 8, blurb: 'Back the next unicorn.' },
];
export const INVESTMENT_MAP: Record<string, InvestmentDef> = Object.fromEntries(INVESTMENTS.map((i) => [i.key, i]));
export const MAX_ACTIVE_INVESTMENTS = 3;

export const RISK_COLORS: Record<Risk, string> = { low: '#10B981', medium: '#F59E0B', high: '#F97316', extreme: '#EF4444' };
export const SENTIMENT_META: Record<string, { label: string; color: string; icon: string }> = {
  bullish: { label: 'Bullish', color: '#10B981', icon: 'arrow-up-circle' },
  neutral: { label: 'Neutral', color: '#94A3B8', icon: 'remove-circle' },
  bearish: { label: 'Bearish', color: '#EF4444', icon: 'arrow-down-circle' },
};

export const DAILY_REWARDS = [
  { day: 1, cashMult: 1, coins: 0 },
  { day: 2, cashMult: 1.5, coins: 0 },
  { day: 3, cashMult: 2, coins: 10 },
  { day: 4, cashMult: 2.5, coins: 0 },
  { day: 5, cashMult: 3, coins: 15 },
  { day: 6, cashMult: 4, coins: 0 },
  { day: 7, cashMult: 6, coins: 50 },
];

export const ACHIEVEMENTS: Record<string, { title: string; description: string; target: number; icon: string }> = {
  first_1000: { title: 'First $1,000', description: 'Earn $1,000 total', target: 1000, icon: 'cash' },
  first_business: { title: 'First Business', description: 'Buy your first business', target: 1, icon: 'storefront' },
  upgraded: { title: 'Upgraded!', description: 'Upgrade a business to Lv 2', target: 1, icon: 'arrow-up-circle' },
  hustler: { title: 'Hustler', description: 'Complete 50 hustles', target: 50, icon: 'flash' },
  employer: { title: 'Employer', description: 'Hire your first employee', target: 1, icon: 'people' },
  investor: { title: 'Investor', description: 'Make your first investment', target: 1, icon: 'trending-up' },
  landlord: { title: 'Landlord', description: 'Buy your first property', target: 1, icon: 'home' },
  wheels: { title: 'New Wheels', description: 'Buy your first vehicle', target: 1, icon: 'car-sport' },
  level_5: { title: 'Level 5', description: 'Reach level 5', target: 5, icon: 'star' },
  level_15: { title: 'Level 15', description: 'Reach level 15', target: 15, icon: 'star-half' },
  empire_5: { title: 'Chain Owner', description: 'Own 5 businesses', target: 5, icon: 'grid' },
  max_level: { title: 'Maxed Out', description: 'Get a business to Lv 10', target: 10, icon: 'trophy' },
  respected: { title: 'Respected', description: 'Reach 60 reputation', target: 60, icon: 'shield-checkmark' },
  millionaire: { title: 'Millionaire', description: 'Reach $1M net worth', target: 1_000_000, icon: 'diamond' },
  streak_7: { title: 'Dedicated', description: '7-day login streak', target: 7, icon: 'calendar' },
  boss_coins_earner: { title: 'Coin Collector', description: 'Earn 100 Boss Coins', target: 100, icon: 'logo-bitcoin' },
};

export const BOSS_COIN_ITEMS = [
  { key: 'energy_refill', name: 'Energy Drink', description: 'Refill energy to full', cost: 10, icon: 'battery-charging' },
  { key: 'xp_booster', name: 'XP Booster', description: '2× XP for 1 hour', cost: 20, icon: 'flash' },
  { key: 'offline_boost', name: 'Night Manager', description: 'Offline earnings cap → 8h', cost: 40, icon: 'moon' },
  { key: 'avatar_frame', name: 'Gold Avatar Frame', description: 'Flex on the leaderboard', cost: 50, icon: 'ribbon' },
  { key: 'business_rename', name: 'Rename Business', description: 'Give a business your brand', cost: 10, icon: 'create' },
] as const;

export const LEADERBOARD_TYPES = [
  { key: 'networth', label: 'Net Worth', icon: 'cash' },
  { key: 'empire', label: 'Empire', icon: 'business' },
  { key: 'investment', label: 'Investor', icon: 'trending-up' },
  { key: 'reputation', label: 'Respect', icon: 'shield-checkmark' },
  { key: 'weekly', label: 'Weekly', icon: 'calendar' },
];

export function formatCash(n: number | null | undefined, decimals = 2): string {
  const v = Number(n ?? 0);
  if (!isFinite(v)) return '$0';
  const sign = v < 0 ? '-' : '';
  const a = Math.abs(v);
  if (a >= 1e12) return `${sign}$${(a / 1e12).toFixed(decimals)}T`;
  if (a >= 1e9) return `${sign}$${(a / 1e9).toFixed(decimals)}B`;
  if (a >= 1e6) return `${sign}$${(a / 1e6).toFixed(decimals)}M`;
  if (a >= 1e4) return `${sign}$${(a / 1e3).toFixed(1)}K`;
  if (a >= 100) return `${sign}$${Math.floor(a).toLocaleString('en-US')}`;
  return `${sign}$${a.toFixed(2)}`;
}

export function formatTime(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds ?? 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${sec.toString().padStart(2, '0')}s`;
  return `${sec}s`;
}

export function rankProgress(netWorth: number): { current: (typeof RANKS)[number]; next: (typeof RANKS)[number] | null; progress: number } {
  let idx = 0;
  RANKS.forEach((r, i) => { if ((netWorth ?? 0) >= r.minNetWorth) idx = i; });
  const current = RANKS[idx] ?? RANKS[0];
  const next = RANKS[idx + 1] ?? null;
  const progress = next ? Math.min(1, Math.max(0, ((netWorth ?? 0) - current.minNetWorth) / (next.minNetWorth - current.minNetWorth))) : 1;
  return { current, next, progress };
}
