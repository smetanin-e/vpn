/*
  Warnings:

  - You are about to drop the `PeerMonthlyStats` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PeerMonthlyStats" DROP CONSTRAINT "PeerMonthlyStats_peerId_fkey";

-- DropTable
DROP TABLE "PeerMonthlyStats";
