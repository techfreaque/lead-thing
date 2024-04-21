/*
  Warnings:

  - You are about to drop the column `billingPeriodDay` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the column `billingPeriodDay` on the `ApiPeriods` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Orders" (
    "transactionId" TEXT NOT NULL PRIMARY KEY,
    "subscriptionId" TEXT,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payedAt" DATETIME,
    "validUntil" DATETIME,
    "paymentStatus" TEXT NOT NULL DEFAULT 'unpaid',
    "productId" TEXT NOT NULL,
    "amount" REAL NOT NULL
);
INSERT INTO "new_Orders" ("amount", "createdAt", "email", "payedAt", "paymentStatus", "productId", "subscriptionId", "transactionId", "validUntil") SELECT "amount", "createdAt", "email", "payedAt", "paymentStatus", "productId", "subscriptionId", "transactionId", "validUntil" FROM "Orders";
DROP TABLE "Orders";
ALTER TABLE "new_Orders" RENAME TO "Orders";
CREATE TABLE "new_ApiPeriods" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validFrom" DATETIME NOT NULL,
    "validUntil" DATETIME NOT NULL,
    "productId" TEXT NOT NULL,
    "apiCallsPerMonth" INTEGER NOT NULL,
    "apiCallsInThisPeriod" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_ApiPeriods" ("apiCallsInThisPeriod", "apiCallsPerMonth", "createdAt", "email", "id", "orderId", "productId", "validFrom", "validUntil") SELECT "apiCallsInThisPeriod", "apiCallsPerMonth", "createdAt", "email", "id", "orderId", "productId", "validFrom", "validUntil" FROM "ApiPeriods";
DROP TABLE "ApiPeriods";
ALTER TABLE "new_ApiPeriods" RENAME TO "ApiPeriods";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
