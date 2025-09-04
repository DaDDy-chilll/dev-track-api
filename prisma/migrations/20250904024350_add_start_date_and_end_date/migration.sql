-- CreateEnum
CREATE TYPE "public"."TaskCategory" AS ENUM ('FEAUTURE', 'BUG', 'REFACTOR', 'TEST', 'ERROR');

-- AlterTable
ALTER TABLE "public"."m_project" ADD COLUMN     "project_file_url" TEXT;

-- AlterTable
ALTER TABLE "public"."t_task" ADD COLUMN     "branch_name" TEXT DEFAULT 'main',
ADD COLUMN     "category" "public"."TaskCategory" NOT NULL DEFAULT 'FEAUTURE',
ADD COLUMN     "end_date" TIMESTAMP(3),
ADD COLUMN     "start_date" TIMESTAMP(3);
