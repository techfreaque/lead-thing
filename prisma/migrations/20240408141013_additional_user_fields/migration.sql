/*
  Warnings:

  - Added the required column `apiCallsPerMonth` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billingPeriodDay` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `apiKey` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "company" TEXT,
    "address" TEXT,
    "zipCode" TEXT,
    "country" TEXT,
    "website" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "apiKeyValidUntil" DATETIME,
    "apiKey" TEXT NOT NULL,
    "billingPeriodDay" INTEGER NOT NULL,
    "apiCallsPerMonth" INTEGER NOT NULL
);
INSERT INTO "new_User" ("address", "apiKey", "apiKeyValidUntil", "company", "country", "createdAt", "email", "id", "name", "password", "updatedAt", "website", "zipCode") SELECT "address", "apiKey", "apiKeyValidUntil", "company", "country", "createdAt", "email", "id", "name", "password", "updatedAt", "website", "zipCode" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_apiKey_key" ON "User"("apiKey");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
