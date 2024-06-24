/*
  Warnings:

  - You are about to drop the `_ObjectiveToOkrDesing` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `okrDesignId` to the `Objective` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ObjectiveToOkrDesing" DROP CONSTRAINT "_ObjectiveToOkrDesing_A_fkey";

-- DropForeignKey
ALTER TABLE "_ObjectiveToOkrDesing" DROP CONSTRAINT "_ObjectiveToOkrDesing_B_fkey";

-- AlterTable
ALTER TABLE "Objective" ADD COLUMN     "okrDesignId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_ObjectiveToOkrDesing";

-- AddForeignKey
ALTER TABLE "Objective" ADD CONSTRAINT "Objective_okrDesignId_fkey" FOREIGN KEY ("okrDesignId") REFERENCES "OkrDesing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
