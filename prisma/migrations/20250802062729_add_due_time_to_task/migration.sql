/*
  Warnings:

  - You are about to alter the column `duration` on the `t_task` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "t_task" ADD COLUMN     "due_time" TIMESTAMP(6),
ALTER COLUMN "duration" SET DATA TYPE INTEGER;
