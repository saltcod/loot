/*
  Warnings:

  - You are about to drop the `CategoryKeywords` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "CategoryKeywords_category_keyword_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CategoryKeywords";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Categories" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "category" TEXT NOT NULL,
    "keyword" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_Categories" ("category", "id") SELECT "category", "id" FROM "Categories";
DROP TABLE "Categories";
ALTER TABLE "new_Categories" RENAME TO "Categories";
CREATE UNIQUE INDEX "Categories_category_keyword_key" ON "Categories"("category", "keyword");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
