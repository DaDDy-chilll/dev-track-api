import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { PrismaClient } from '@prisma/client';
import { ProjectRepo } from './project.repo';
import { TaskRepo } from '../task/task.repo';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, PrismaClient, ProjectRepo, TaskRepo],
})
export class ProjectModule {}
