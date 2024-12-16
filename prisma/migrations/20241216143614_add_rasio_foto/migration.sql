-- AlterTable
ALTER TABLE "Spam" ADD COLUMN     "kapasitas_intake" DECIMAL(65,30),
ADD COLUMN     "kapasitas_produksi" DECIMAL(65,30),
ADD COLUMN     "sumber_air" TEXT,
ADD COLUMN     "sumber_tenaga" TEXT;

-- CreateTable
CREATE TABLE "RasioSpam" (
    "id" SERIAL NOT NULL,
    "spamId" INTEGER,
    "terlayani" INTEGER NOT NULL,
    "tidak_terlayani" INTEGER NOT NULL,
    "total_laki_laki" INTEGER NOT NULL,
    "total_peempuan" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RasioSpam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FotoSpam" (
    "id" SERIAL NOT NULL,
    "spamId" INTEGER,
    "foto_wtp" TEXT,
    "foto_intake" TEXT,
    "foto_roservoir" TEXT,
    "foto_rumah_dosing" TEXT,
    "foto_pompa_distibusi" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FotoSpam_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RasioSpam_spamId_key" ON "RasioSpam"("spamId");

-- CreateIndex
CREATE UNIQUE INDEX "FotoSpam_spamId_key" ON "FotoSpam"("spamId");

-- AddForeignKey
ALTER TABLE "RasioSpam" ADD CONSTRAINT "RasioSpam_spamId_fkey" FOREIGN KEY ("spamId") REFERENCES "Spam"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FotoSpam" ADD CONSTRAINT "FotoSpam_spamId_fkey" FOREIGN KEY ("spamId") REFERENCES "Spam"("id") ON DELETE SET NULL ON UPDATE CASCADE;
