-- CreateTable
CREATE TABLE "ShpFile" (
    "id" SERIAL NOT NULL,
    "geojson" JSONB NOT NULL,

    CONSTRAINT "ShpFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpmShp" (
    "id" SERIAL NOT NULL,
    "spamId" INTEGER NOT NULL,
    "shpFileId" INTEGER NOT NULL,

    CONSTRAINT "SpmShp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SpmShp_shpFileId_key" ON "SpmShp"("shpFileId");

-- AddForeignKey
ALTER TABLE "SpmShp" ADD CONSTRAINT "SpmShp_spamId_fkey" FOREIGN KEY ("spamId") REFERENCES "Spam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpmShp" ADD CONSTRAINT "SpmShp_shpFileId_fkey" FOREIGN KEY ("shpFileId") REFERENCES "ShpFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
