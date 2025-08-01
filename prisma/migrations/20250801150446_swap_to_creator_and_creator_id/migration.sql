/*
  Warnings:

  - You are about to drop the column `hostId` on the `OpenMic` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "public"."Genre" ADD VALUE 'ROCK';

-- DropForeignKey
ALTER TABLE "public"."OpenMic" DROP CONSTRAINT "OpenMic_hostId_fkey";

-- AlterTable
ALTER TABLE "public"."OpenMic" DROP COLUMN "hostId",
ADD COLUMN     "creatorId" TEXT,
ADD COLUMN     "hostWebsite" TEXT;

-- AddForeignKey
ALTER TABLE "public"."OpenMic" ADD CONSTRAINT "OpenMic_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
