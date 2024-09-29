/*
  Warnings:

  - The primary key for the `UserSession` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `id` to the `UserSession` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserSession" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" BIGINT NOT NULL,
    "isOnBoarded" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_UserSession" ("isOnBoarded", "userId") SELECT "isOnBoarded", "userId" FROM "UserSession";
DROP TABLE "UserSession";
ALTER TABLE "new_UserSession" RENAME TO "UserSession";
PRAGMA foreign_key_check("UserSession");
PRAGMA foreign_keys=ON;
