/*
  Warnings:

  - You are about to drop the `spam` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "spam";

-- CreateTable
CREATE TABLE "Spam" (
    "id" BIGSERIAL NOT NULL,
    "lat" BIGINT NOT NULL,
    "long" BIGINT NOT NULL,
    "nama" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "kapasitas" DECIMAL(65,30) NOT NULL,
    "sr" DECIMAL(65,30) NOT NULL,
    "pengelola" TEXT NOT NULL,
    "riwayat_aktivitas" TEXT NOT NULL,
    "cakupan" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Spam_pkey" PRIMARY KEY ("id")
);
