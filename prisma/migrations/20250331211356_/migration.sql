-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_patientId_fkey";

-- AlterTable
ALTER TABLE "Room" ALTER COLUMN "patientId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;
