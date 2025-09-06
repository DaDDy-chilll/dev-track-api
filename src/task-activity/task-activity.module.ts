import { Module } from '@nestjs/common';
import { TaskActivityService } from './task-activity.service';
import { TaskActivityController } from './task-activity.controller';

@Module({
  controllers: [TaskActivityController],
  providers: [TaskActivityService],
})
export class TaskActivityModule {}
