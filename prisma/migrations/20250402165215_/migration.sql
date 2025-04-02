/*
  Warnings:

  - You are about to drop the column `department` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `doctor` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `insurance` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `zipCode` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `department` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `experience` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `qualifications` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `specialization` on the `Staff` table. All the data in the column will be lost.
  - The `gender` column on the `Staff` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Room` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `gender` on the `Patient` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `role` on the `Staff` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StaffRole" AS ENUM ('admin', 'medecin', 'infirmier', 'radiologue', 'laborantin', 'comptable');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female');

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_patientId_fkey";

-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_patientId_fkey";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "department";

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "city",
DROP COLUMN "doctor",
DROP COLUMN "insurance",
DROP COLUMN "state",
DROP COLUMN "zipCode",
DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender" NOT NULL;

-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "department",
DROP COLUMN "experience",
DROP COLUMN "qualifications",
DROP COLUMN "specialization",
DROP COLUMN "role",
ADD COLUMN     "role" "StaffRole" NOT NULL,
DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "StaffRole" NOT NULL;

-- DropTable
DROP TABLE "Room";

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;
