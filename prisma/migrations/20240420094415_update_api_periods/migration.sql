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
    "amount" REAL NOT NULL,
    "billingPeriodDay" INTEGER
);
INSERT INTO "new_Orders" ("amount", "billingPeriodDay", "createdAt", "email", "payedAt", "paymentStatus", "productId", "subscriptionId", "transactionId", "validUntil") SELECT "amount", "billingPeriodDay", "createdAt", "email", "payedAt", "paymentStatus", "productId", "subscriptionId", "transactionId", "validUntil" FROM "Orders";
DROP TABLE "Orders";
ALTER TABLE "new_Orders" RENAME TO "Orders";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
