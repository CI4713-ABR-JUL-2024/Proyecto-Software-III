-- DropForeignKey
ALTER TABLE "ObjectiveDetail" DROP CONSTRAINT "ObjectiveDetail_keyResult_id_fkey";

-- AlterTable
ALTER TABLE "ObjectiveDetail" ALTER COLUMN "keyResult_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ObjectiveDetail" ADD CONSTRAINT "ObjectiveDetail_keyResult_id_fkey" FOREIGN KEY ("keyResult_id") REFERENCES "KeyResult"("id") ON DELETE SET NULL ON UPDATE CASCADE;
