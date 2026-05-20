-- CreateEnum
CREATE TYPE "ChargeStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "daily_charge_logs" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "totalClients" INTEGER NOT NULL DEFAULT 0,
    "successfulCount" INTEGER NOT NULL DEFAULT 0,
    "failedCount" INTEGER NOT NULL DEFAULT 0,
    "totalAmount" BIGINT NOT NULL DEFAULT 0,
    "totalBalance" BIGINT NOT NULL DEFAULT 0,
    "failedDetails" JSONB,
    "disabledPeers" JSONB,
    "duration" INTEGER,
    "status" "ChargeStatus" NOT NULL DEFAULT 'PENDING',
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_charge_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "daily_charge_logs_date_key" ON "daily_charge_logs"("date");

-- CreateIndex
CREATE INDEX "daily_charge_logs_date_idx" ON "daily_charge_logs"("date");
