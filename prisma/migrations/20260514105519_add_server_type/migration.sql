/*
  Warnings:

  - Added the required column `type` to the `Server` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ServerType" AS ENUM ('WG_REST_API', 'AMNEZIA_API');

-- AlterTable
ALTER TABLE "Server" ADD COLUMN     "type" "ServerType" NOT NULL;
