/*
  Warnings:

  - The primary key for the `Orders` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the column `apiCallsInThisPeriod` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `apiCallsPerMonth` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `apiKeyValidUntil` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `billingPeriodDay` on the `User` table. All the data in the column will be lost.
  - Added the required column `billingPeriodDay` to the `Orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subscriptionId` to the `Orders` table without a default value. This is not possible if the table is not empty.
  - The required column `transactionId` was added to the `Orders` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- CreateTable
CREATE TABLE "ApiPeriods" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validFrom" DATETIME NOT NULL,
    "validUntil" DATETIME NOT NULL,
    "productId" TEXT NOT NULL,
    "apiCallsPerMonth" INTEGER NOT NULL,
    "apiCallsInThisPeriod" INTEGER NOT NULL DEFAULT 0,
    "billingPeriodDay" INTEGER NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Orders" (
    "transactionId" TEXT NOT NULL PRIMARY KEY,
    "subscriptionId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payedAt" DATETIME,
    "validUntil" DATETIME,
    "paymentStatus" TEXT NOT NULL DEFAULT 'unpaid',
    "productId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "billingPeriodDay" INTEGER NOT NULL
);
INSERT INTO "new_Orders" ("amount", "createdAt", "email", "payedAt", "paymentStatus", "productId", "validUntil") SELECT "amount", "createdAt", "email", "payedAt", "paymentStatus", "productId", "validUntil" FROM "Orders";
DROP TABLE "Orders";
ALTER TABLE "new_Orders" RENAME TO "Orders";
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
    "resetPasswordToken" TEXT,
    "resetPasswordTokenTime" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "apiKey" TEXT NOT NULL
);
INSERT INTO "new_User" ("address", "apiKey", "company", "country", "createdAt", "email", "id", "name", "password", "resetPasswordToken", "resetPasswordTokenTime", "updatedAt", "website", "zipCode") SELECT "address", "apiKey", "company", "country", "createdAt", "email", "id", "name", "password", "resetPasswordToken", "resetPasswordTokenTime", "updatedAt", "website", "zipCode" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_resetPasswordToken_key" ON "User"("resetPasswordToken");
CREATE UNIQUE INDEX "User_apiKey_key" ON "User"("apiKey");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
