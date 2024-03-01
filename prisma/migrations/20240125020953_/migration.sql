/*
  Warnings:

  - You are about to drop the column `name` on the `Categories` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "CategoryKeywords" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "category" TEXT NOT NULL,
    "keyword" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Categories" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "category" TEXT NOT NULL
);
INSERT INTO "new_Categories" ("category", "id") SELECT "category", "id" FROM "Categories";
DROP TABLE "Categories";
ALTER TABLE "new_Categories" RENAME TO "Categories";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "CategoryKeywords_category_keyword_key" ON "CategoryKeywords"("category", "keyword");
