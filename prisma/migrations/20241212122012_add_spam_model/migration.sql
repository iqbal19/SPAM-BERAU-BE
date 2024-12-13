-- AlterTable
ALTER TABLE "User" ALTER COLUMN "status" SET DEFAULT 'AKTIF',
ALTER COLUMN "role" SET DEFAULT 'ADMIN';

-- CreateTable
CREATE TABLE "Desa" (
    "id" BIGSERIAL NOT NULL,
    "kecamatan_id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "is_delete" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Desa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spam" (
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

    CONSTRAINT "spam_pkey" PRIMARY KEY ("id")
);
