-- CreateTable
CREATE TABLE "SpamTitik" (
    "id" SERIAL NOT NULL,
    "spamId" INTEGER,
    "lat_intake" DECIMAL(65,30) NOT NULL,
    "long_intake" DECIMAL(65,30) NOT NULL,
    "lat_wtp" DECIMAL(65,30) NOT NULL,
    "long_wtp" DECIMAL(65,30) NOT NULL,
    "lat_roservoir" DECIMAL(65,30) NOT NULL,
    "long_roservoir" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpamTitik_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SpamTitik_spamId_key" ON "SpamTitik"("spamId");

-- AddForeignKey
ALTER TABLE "SpamTitik" ADD CONSTRAINT "SpamTitik_spamId_fkey" FOREIGN KEY ("spamId") REFERENCES "Spam"("id") ON DELETE SET NULL ON UPDATE CASCADE;
