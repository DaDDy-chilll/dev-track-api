import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskRepo {
  constructor(private prisma: PrismaClient) {}
  create(createTaskDto: CreateTaskDto) {
    // Map the DTO fields to match the Prisma schema
    return this.prisma.t_task.create({
      data: {
        name: createTaskDto.name,
        duration: createTaskDto.duration,
        status: createTaskDto.status,
        priority: createTaskDto.priority,
        project_id: createTaskDto.project_id,
      },
    });
  }
  findAll() {
    return this.prisma.t_task.findMany();
  }
  findOne(id: number) {
    return this.prisma.t_task.findUnique({
      where: {
        id,
      },
    });
  }
  update(id: number, updateTaskDto: UpdateTaskDto) {
    return this.prisma.t_task.update({
      where: {
        id,
      },
      data: updateTaskDto,
    });
  }
  remove(id: number) {
    return this.prisma.t_task.delete({
      where: {
        id,
      },
    });
  }

  findAllByProjectId(projectId: number) {
    return this.prisma.t_task.findMany({
      where: {
        project_id: projectId,
      },
    });
  }
}
