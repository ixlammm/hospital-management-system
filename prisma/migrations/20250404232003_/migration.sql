-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "ibe_a" TEXT,
ADD COLUMN     "ibe_r" TEXT;

-- CreateTable
CREATE TABLE "ibe" (
    "n" TEXT NOT NULL,
    "p" TEXT NOT NULL,
    "q" TEXT NOT NULL,

    CONSTRAINT "ibe_pkey" PRIMARY KEY ("n")
);
