-- CreateTable
CREATE TABLE "public"."t_project_task_status" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "status" "public"."TaskStatus" NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "t_project_task_status_pkey" PRIMARY KEY ("id")
);
