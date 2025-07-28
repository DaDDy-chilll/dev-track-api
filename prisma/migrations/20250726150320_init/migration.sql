-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PLANING', 'DEVELOPMENT', 'COMPLETED', 'MAINTENANCE', 'HOLDING', 'FINISHED');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'DONE');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateTable
CREATE TABLE "m_project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image_id" INTEGER,
    "status" "ProjectStatus" NOT NULL DEFAULT 'PLANING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "m_project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_image" (
    "id" SERIAL NOT NULL,
    "filename" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "t_image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "t_task" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "duration" TIMESTAMP(3) NOT NULL,
    "priority" "TaskPriority" NOT NULL,
    "status" "TaskStatus" NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "t_task_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "m_project_image_id_key" ON "m_project"("image_id");

-- AddForeignKey
ALTER TABLE "m_project" ADD CONSTRAINT "m_project_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "t_image"("id") ON DELETE SET NULL ON UPDATE CASCADE;
