/*
  Warnings:

  - You are about to drop the column `due_time` on the `t_task` table. All the data in the column will be lost.
  - Changed the type of `duration` on the `t_task` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "t_task" DROP COLUMN "due_time",
DROP COLUMN "duration",
ADD COLUMN     "duration" TIMESTAMP(3) NOT NULL;
