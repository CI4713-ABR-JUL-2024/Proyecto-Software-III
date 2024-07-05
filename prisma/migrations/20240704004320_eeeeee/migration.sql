/*
  Warnings:

  - You are about to drop the column `initiative` on the `ObjectiveDetail` table. All the data in the column will be lost.
  - You are about to drop the column `initiativeType_id` on the `ObjectiveDetail` table. All the data in the column will be lost.
  - You are about to drop the column `keyIndicator` on the `ObjectiveDetail` table. All the data in the column will be lost.
  - You are about to drop the column `keyResult` on the `ObjectiveDetail` table. All the data in the column will be lost.
  - Added the required column `keyResult_id` to the `ObjectiveDetail` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ObjectiveDetail" DROP CONSTRAINT "ObjectiveDetail_initiativeType_id_fkey";

-- AlterTable
ALTER TABLE "ObjectiveDetail" DROP COLUMN "initiative",
DROP COLUMN "initiativeType_id",
DROP COLUMN "keyIndicator",
DROP COLUMN "keyResult",
ADD COLUMN     "keyResult_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "KeyResult" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "keyResult" TEXT NOT NULL,
    "keyIndicator" TEXT NOT NULL,
    "initiative" TEXT NOT NULL,
    "initiativeType_id" INTEGER NOT NULL,
    "priority" INTEGER NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "typeOfValue" TEXT NOT NULL,

    CONSTRAINT "KeyResult_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ObjectiveDetail" ADD CONSTRAINT "ObjectiveDetail_keyResult_id_fkey" FOREIGN KEY ("keyResult_id") REFERENCES "KeyResult"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeyResult" ADD CONSTRAINT "KeyResult_initiativeType_id_fkey" FOREIGN KEY ("initiativeType_id") REFERENCES "InitiativeType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
