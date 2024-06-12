/*
  Warnings:

  - You are about to drop the column `user` on the `Log` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `Log` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Log" DROP COLUMN "user",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
