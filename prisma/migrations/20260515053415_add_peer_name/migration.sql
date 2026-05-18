/*
  Warnings:

  - You are about to drop the column `amneziaPeerId` on the `Peer` table. All the data in the column will be lost.
  - You are about to drop the column `wgPeerId` on the `Peer` table. All the data in the column will be lost.
  - Added the required column `externalId` to the `Peer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Peer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Peer" DROP COLUMN "amneziaPeerId",
DROP COLUMN "wgPeerId",
ADD COLUMN     "externalId" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
