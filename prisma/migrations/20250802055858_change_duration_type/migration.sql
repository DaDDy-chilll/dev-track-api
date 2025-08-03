/*
  Warnings:

  - Changed the type of `duration` on the `t_task` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "t_task" DROP COLUMN "duration",
ADD COLUMN     "duration" BIGINT NOT NULL;
