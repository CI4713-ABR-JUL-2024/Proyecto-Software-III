/*
  Warnings:

  - Added the required column `aproach_id` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_id` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trimester` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "aproach_id" INTEGER NOT NULL,
ADD COLUMN     "organization_id" INTEGER NOT NULL,
ADD COLUMN     "trimester" TEXT NOT NULL,
ADD COLUMN     "year" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Organization" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "cellphone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "personResponsible" TEXT NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Approach" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Approach_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_aproach_id_fkey" FOREIGN KEY ("aproach_id") REFERENCES "Approach"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
