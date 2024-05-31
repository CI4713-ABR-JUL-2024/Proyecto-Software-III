/*
  Warnings:

  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role_name" TEXT;

-- CreateTable
CREATE TABLE "Role" (
    "name" TEXT NOT NULL,
    "Description" TEXT,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("name")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_role_name_fkey" FOREIGN KEY ("role_name") REFERENCES "Role"("name") ON DELETE SET NULL ON UPDATE CASCADE;
