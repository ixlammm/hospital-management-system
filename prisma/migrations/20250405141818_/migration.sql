/*
  Warnings:

  - You are about to drop the column `a_hex` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `r_encrypted` on the `Staff` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "abe_user_key" TEXT;

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "abe_user_key" TEXT;

-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "a_hex",
DROP COLUMN "r_encrypted",
ADD COLUMN     "abe_user_key" TEXT;
