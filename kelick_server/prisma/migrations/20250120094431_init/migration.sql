-- CreateTable
CREATE TABLE "TaxData" (
    "id" SERIAL NOT NULL,
    "employeeName" TEXT NOT NULL,
    "taxYear" TEXT NOT NULL,
    "taxableIncome" INTEGER NOT NULL,
    "taxAmount" INTEGER NOT NULL,

    CONSTRAINT "TaxData_pkey" PRIMARY KEY ("id")
);
