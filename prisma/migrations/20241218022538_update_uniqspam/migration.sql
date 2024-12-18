-- DropForeignKey
ALTER TABLE "SpmShp" DROP CONSTRAINT "SpmShp_shpFileId_fkey";

-- DropForeignKey
ALTER TABLE "SpmShp" DROP CONSTRAINT "SpmShp_spamId_fkey";

-- DropIndex
DROP INDEX "SpmShp_shpFileId_key";

-- AlterTable
ALTER TABLE "SpmShp" ALTER COLUMN "spamId" DROP NOT NULL,
ALTER COLUMN "shpFileId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "SpmShp" ADD CONSTRAINT "SpmShp_spamId_fkey" FOREIGN KEY ("spamId") REFERENCES "Spam"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpmShp" ADD CONSTRAINT "SpmShp_shpFileId_fkey" FOREIGN KEY ("shpFileId") REFERENCES "ShpFile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
