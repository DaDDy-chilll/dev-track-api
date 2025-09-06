import { Test, TestingModule } from '@nestjs/testing';
import { TaskActivityController } from './task-activity.controller';
import { TaskActivityService } from './task-activity.service';

describe('TaskActivityController', () => {
  let controller: TaskActivityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskActivityController],
      providers: [TaskActivityService],
    }).compile();

    controller = module.get<TaskActivityController>(TaskActivityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
