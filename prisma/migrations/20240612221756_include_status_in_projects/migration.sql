/*
  Warnings:

  - You are about to drop the column `isEnabled` on the `Project` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DELETED');

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "isEnabled",
ADD COLUMN     "status" "ProjectStatus" NOT NULL DEFAULT 'ACTIVE';
