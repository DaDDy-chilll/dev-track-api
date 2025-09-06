import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateTaskActivityDto } from './dto/create-task-activity.dto';
import { UpdateTaskActivityDto } from './dto/update-task-activity.dto';

@Injectable()
export class TaskActivityRepo {
  constructor(private prisma: PrismaClient) {}

  async create(createTaskActivityDto: CreateTaskActivityDto) {
    const taskActivity = await this.prisma.t_task_activity.create({
      data: createTaskActivityDto,
    });
    return taskActivity;
  }

  async remove(id: number) {
    const taskActivity = await this.prisma.t_task_activity.delete({
      where: { id },
    });
    return taskActivity;
  }

  async findAll() {
    const taskActivity = await this.prisma.t_task_activity.findMany({
      where: {},
    });
    return taskActivity;
  }

  async findOne(id: number) {
    const taskActivity = await this.prisma.t_task_activity.findUnique({
      where: { id },
    });
    return taskActivity;
  }

  async update(id: number, updateTaskActivityDto: UpdateTaskActivityDto) {
    const taskActivity = await this.prisma.t_task_activity.update({
      where: { id },
      data: updateTaskActivityDto,
    });
    return taskActivity;
  }

  async findByTaskId(taskId: number) {
    const taskActivity = await this.prisma.t_task_activity.findMany({
      where: { task_id: taskId },
    });
    return taskActivity;
  }

  async findAndUpdate(
    taskId: number,
    updateTaskActivityDto: UpdateTaskActivityDto,
  ) {
    // First find the activity by task_id
    const activity = await this.prisma.t_task_activity.findFirst({
      where: { task_id: taskId },
    });

    if (!activity) {
      throw new Error('Task activity not found');
    }

    // Then update using the found id
    const taskActivity = await this.prisma.t_task_activity.update({
      where: { id: activity.id },
      data: updateTaskActivityDto,
    });
    return taskActivity;
  }
}
