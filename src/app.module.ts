import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { ImageModule } from './image/image.module';
import { PowerModule } from './power/power.module';
import { DeviceModule } from './device/device.module';
import { DeviceFilterMiddleware } from './common/middleware/device-filter.middleware';
import { TaskActivityModule } from './task-activity/task-activity.module';

@Module({
  imports: [
    ProjectModule,
    TaskModule,
    ImageModule,
    PowerModule,
    DeviceModule,
    TaskActivityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DeviceFilterMiddleware)
      .exclude('/devices/*', '/images/*', '/images', '/api/v1', {
        path: '/images/*',
        method: RequestMethod.ALL,
      }) // Exclude device management, image endpoints, and API base route from filtering
      .forRoutes('v1'); // Apply to all other routes
  }
}
