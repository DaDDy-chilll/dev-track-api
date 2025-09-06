import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TaskRepo } from './task.repo';
import { PrismaClient } from '@prisma/client';
import { ProjectRepo } from '../project/project.repo';
import { TaskActivityRepo } from '../task-activity/task-activity.repo';

@Module({
  controllers: [TaskController],
  providers: [
    TaskService,
    TaskRepo,
    PrismaClient,
    ProjectRepo,
    TaskActivityRepo,
  ],
})
export class TaskModule {}
