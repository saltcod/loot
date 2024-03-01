/*
  Warnings:

  - You are about to drop the column `category` on the `Categories` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `Categories` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "CategoriesLookup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "category" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Categories" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "keyword" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    CONSTRAINT "Categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CategoriesLookup" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Categories" ("id", "keyword") SELECT "id", "keyword" FROM "Categories";
DROP TABLE "Categories";
ALTER TABLE "new_Categories" RENAME TO "Categories";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "CategoriesLookup_category_key" ON "CategoriesLookup"("category");
