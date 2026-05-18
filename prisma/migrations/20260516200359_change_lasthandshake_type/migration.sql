/*
  Warnings:

  - The `lastHandshake` column on the `Peer` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Peer" DROP COLUMN "lastHandshake",
ADD COLUMN     "lastHandshake" TIMESTAMP(3);
