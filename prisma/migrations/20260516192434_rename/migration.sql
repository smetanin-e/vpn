/*
  Warnings:

  - You are about to drop the column `sendBytes` on the `Peer` table. All the data in the column will be lost.
  - You are about to drop the column `sendBytes` on the `PeerMonthlyStats` table. All the data in the column will be lost.
  - Added the required column `sentBytes` to the `PeerMonthlyStats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Peer" DROP COLUMN "sendBytes",
ADD COLUMN     "sentBytes" BIGINT NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "PeerMonthlyStats" DROP COLUMN "sendBytes",
ADD COLUMN     "sentBytes" BIGINT NOT NULL;
