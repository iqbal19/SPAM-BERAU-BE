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
    "status" "Status" NOT NULL DEFAULT 'NON_AKTIF',
    "role" "Role" NOT NULL DEFAULT 'ADMIN_APLIKASI',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
