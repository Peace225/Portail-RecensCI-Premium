/*
  Warnings:

  - You are about to drop the column `witness_name` on the `marriage_records` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "marriage_records" DROP COLUMN "witness_name",
ADD COLUMN     "witnesses" JSONB DEFAULT '[]';
