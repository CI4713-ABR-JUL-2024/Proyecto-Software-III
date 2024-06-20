-- CreateTable
CREATE TABLE "Objective" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Objective_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ObjectiveDetail" (
    "id" SERIAL NOT NULL,
    "objective_id" INTEGER NOT NULL,
    "keyResult" TEXT NOT NULL,
    "keyIndicator" TEXT NOT NULL,
    "initiative" TEXT NOT NULL,
    "initiativeType_id" INTEGER NOT NULL,

    CONSTRAINT "ObjectiveDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InitiativeType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "InitiativeType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OkrDesing" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,

    CONSTRAINT "OkrDesing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ObjectiveToOkrDesing" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "OkrDesing_project_id_key" ON "OkrDesing"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "_ObjectiveToOkrDesing_AB_unique" ON "_ObjectiveToOkrDesing"("A", "B");

-- CreateIndex
CREATE INDEX "_ObjectiveToOkrDesing_B_index" ON "_ObjectiveToOkrDesing"("B");

-- AddForeignKey
ALTER TABLE "ObjectiveDetail" ADD CONSTRAINT "ObjectiveDetail_objective_id_fkey" FOREIGN KEY ("objective_id") REFERENCES "Objective"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObjectiveDetail" ADD CONSTRAINT "ObjectiveDetail_initiativeType_id_fkey" FOREIGN KEY ("initiativeType_id") REFERENCES "InitiativeType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OkrDesing" ADD CONSTRAINT "OkrDesing_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ObjectiveToOkrDesing" ADD CONSTRAINT "_ObjectiveToOkrDesing_A_fkey" FOREIGN KEY ("A") REFERENCES "Objective"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ObjectiveToOkrDesing" ADD CONSTRAINT "_ObjectiveToOkrDesing_B_fkey" FOREIGN KEY ("B") REFERENCES "OkrDesing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
