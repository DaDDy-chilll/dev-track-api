-- AlterTable
ALTER TABLE "m_project" ADD COLUMN     "color" TEXT DEFAULT '#2196F3',
ADD COLUMN     "isNew" BOOLEAN DEFAULT true,
ADD COLUMN     "member_count" DECIMAL DEFAULT 0,
ADD COLUMN     "task_count" DECIMAL DEFAULT 0;

-- AlterTable
ALTER TABLE "t_task" ADD COLUMN     "project_id" INTEGER;

-- AddForeignKey
ALTER TABLE "t_task" ADD CONSTRAINT "t_task_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "m_project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
