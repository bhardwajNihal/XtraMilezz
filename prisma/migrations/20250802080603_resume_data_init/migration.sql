/*
  Warnings:

  - Added the required column `data` to the `Resume` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Resume" ADD COLUMN     "data" JSONB NOT NULL;
