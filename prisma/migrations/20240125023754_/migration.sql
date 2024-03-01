-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Categories" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "category" TEXT NOT NULL,
    "keyword" TEXT NOT NULL
);
INSERT INTO "new_Categories" ("category", "id", "keyword") SELECT "category", "id", "keyword" FROM "Categories";
DROP TABLE "Categories";
ALTER TABLE "new_Categories" RENAME TO "Categories";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
