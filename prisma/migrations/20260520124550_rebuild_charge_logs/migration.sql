/*
  Warnings:

  - You are about to drop the column `duration` on the `daily_charge_logs` table. All the data in the column will be lost.
  - You are about to drop the column `totalBalance` on the `daily_charge_logs` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "daily_charge_logs_date_idx";

-- AlterTable
ALTER TABLE "daily_charge_logs" DROP COLUMN "duration",
DROP COLUMN "totalBalance";
