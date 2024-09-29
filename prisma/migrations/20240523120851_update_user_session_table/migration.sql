/*
  Warnings:

  - You are about to drop the column `userId` on the `UserSession` table. All the data in the column will be lost.
  - Added the required column `shop` to the `UserSession` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserSession" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop" TEXT NOT NULL,
    "isOnBoarded" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_UserSession" ("createdAt", "id", "isOnBoarded") SELECT "createdAt", "id", "isOnBoarded" FROM "UserSession";
DROP TABLE "UserSession";
ALTER TABLE "new_UserSession" RENAME TO "UserSession";
PRAGMA foreign_key_check("UserSession");
PRAGMA foreign_keys=ON;
