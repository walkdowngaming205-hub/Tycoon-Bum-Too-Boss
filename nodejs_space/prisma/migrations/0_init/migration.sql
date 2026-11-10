-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "playerName" TEXT NOT NULL,
    "avatarEmoji" TEXT NOT NULL DEFAULT '😎',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_state" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "cash" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "bossCoins" INTEGER NOT NULL DEFAULT 50,
    "totalEarned" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalHustleTaps" INTEGER NOT NULL DEFAULT 0,
    "totalBossCoinsEarned" INTEGER NOT NULL DEFAULT 50,
    "reputation" INTEGER NOT NULL DEFAULT 10,
    "investmentReturns" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "investmentWinRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "weekStartNetWorth" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "weekStartDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "offlineMaxHours" INTEGER NOT NULL DEFAULT 4,
    "xpBoostUntil" TIMESTAMP(3),
    "tapBoostUntil" TIMESTAMP(3),
    "hasAvatarFrame" BOOLEAN NOT NULL DEFAULT false,
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "adCountToday" INTEGER NOT NULL DEFAULT 0,
    "adCountResetDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "energy" INTEGER NOT NULL DEFAULT 100,
    "energyUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dailyStreak" INTEGER NOT NULL DEFAULT 0,
    "lastDailyClaim" TIMESTAMP(3),
    "properties" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "vehicles" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "researched" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "pendingEvent" TEXT,
    "lastEventAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "investmentsMade" INTEGER NOT NULL DEFAULT 0,
    "investmentsWon" INTEGER NOT NULL DEFAULT 0,
    "debt" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pendingOffline" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pendingOfflineSeconds" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_state_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "businessType" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "employees" INTEGER NOT NULL DEFAULT 0,
    "customName" TEXT,
    "incomeBoostUntil" TIMESTAMP(3),
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievement" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "achievementKey" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investment" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "opportunityKey" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "sentiment" TEXT NOT NULL,
    "researched" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'active',
    "multiplier" DOUBLE PRECISION,
    "payout" DOUBLE PRECISION,
    "maturesAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "investment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "game_state_userId_key" ON "game_state"("userId");

-- CreateIndex
CREATE INDEX "business_userId_idx" ON "business"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "business_userId_businessType_key" ON "business"("userId", "businessType");

-- CreateIndex
CREATE INDEX "achievement_userId_idx" ON "achievement"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "achievement_userId_achievementKey_key" ON "achievement"("userId", "achievementKey");

-- CreateIndex
CREATE INDEX "investment_userId_idx" ON "investment"("userId");

-- AddForeignKey
ALTER TABLE "game_state" ADD CONSTRAINT "game_state_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business" ADD CONSTRAINT "business_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "achievement" ADD CONSTRAINT "achievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investment" ADD CONSTRAINT "investment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

