/*
  Warnings:

  - You are about to drop the column `Description` on the `Role` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Role" DROP COLUMN "Description",
ADD COLUMN     "description" TEXT;
