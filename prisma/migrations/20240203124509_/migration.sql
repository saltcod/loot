/*
  Warnings:

  - You are about to drop the `ExcludeList` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ExcludeList";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Exclude" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Exclude_name_key" ON "Exclude"("name");
