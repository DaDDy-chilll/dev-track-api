/*
  Warnings:

  - You are about to drop the column `duration` on the `t_task` table. All the data in the column will be lost.
  - Added the required column `due_time` to the `t_task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."t_task" DROP COLUMN "duration",
ADD COLUMN     "due_time" TIMESTAMP(3) NOT NULL;
