-- CreateEnum
CREATE TYPE "Status" AS ENUM ('AKTIF', 'NON_AKTIF');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN_APLIKASI', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(60),
    "username" VARCHAR(40) NOT NULL,
    "nama" VARCHAR(120) NOT NULL,
    "password" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'AKTIF',
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Desa" (
    "id" SERIAL NOT NULL,
    "kecamatan_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "is_delete" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Desa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Spam" (
    "id" SERIAL NOT NULL,
    "lat" DECIMAL(65,30) NOT NULL,
    "long" DECIMAL(65,30) NOT NULL,
    "nama" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "kapasitas" DECIMAL(65,30) NOT NULL,
    "sr" DECIMAL(65,30) NOT NULL,
    "pengelola" TEXT NOT NULL,
    "riwayat_aktivitas" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Spam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpamCakupan" (
    "id" SERIAL NOT NULL,
    "spamId" INTEGER NOT NULL,
    "desaId" INTEGER NOT NULL,

    CONSTRAINT "SpamCakupan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "SpamCakupan" ADD CONSTRAINT "SpamCakupan_spamId_fkey" FOREIGN KEY ("spamId") REFERENCES "Spam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpamCakupan" ADD CONSTRAINT "SpamCakupan_desaId_fkey" FOREIGN KEY ("desaId") REFERENCES "Desa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
