import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { PrismaClient } from '@prisma/client';
import { ProjectRepo } from './project.repo';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, PrismaClient, ProjectRepo],
})
export class ProjectModule {}
