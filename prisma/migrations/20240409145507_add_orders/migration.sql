-- CreateTable
CREATE TABLE "Orders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payedAt" DATETIME,
    "paymentStatus" TEXT NOT NULL DEFAULT 'unpaid',
    "productId" TEXT NOT NULL,
    "amount" REAL NOT NULL
);
