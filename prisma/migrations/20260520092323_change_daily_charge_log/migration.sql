/*
  Warnings:

  - You are about to alter the column `totalAmount` on the `daily_charge_logs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `totalBalance` on the `daily_charge_logs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "daily_charge_logs" ALTER COLUMN "totalAmount" SET DATA TYPE INTEGER,
ALTER COLUMN "totalBalance" SET DATA TYPE INTEGER;
