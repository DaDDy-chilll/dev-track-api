import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { ImageModule } from './image/image.module';

@Module({
  imports: [ProjectModule, TaskModule, ImageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
