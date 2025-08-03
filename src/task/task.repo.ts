import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskRepo {
  constructor(private prisma: PrismaClient) {}

  private async updateProjectTaskCount(projectId: number) {
    const taskCount = await this.prisma.t_task.count({
      where: { project_id: projectId },
    });
    await this.prisma.m_project.update({
      where: { id: projectId },
      data: { task_count: taskCount },
    });

    return taskCount;
  }

  async create(createTaskDto: CreateTaskDto) {
    const task = await this.prisma.t_task.create({
      data: {
        name: createTaskDto.name,
        due_time: createTaskDto.due_time,
        status: createTaskDto.status,
        priority: createTaskDto.priority,
        project_id: createTaskDto.project_id,
      },
    });

    // Update the task count for the project
    if (createTaskDto.project_id) {
      await this.updateProjectTaskCount(createTaskDto.project_id);
    }

    return task;
  }

  async remove(id: number) {
    // Get the task first to know which project it belongs to
    const task = await this.prisma.t_task.findUnique({
      where: { id },
      select: { project_id: true },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    // Delete the task
    const deletedTask = await this.prisma.t_task.delete({
      where: { id },
    });

    // Update the task count for the project if it was associated with one
    if (task.project_id) {
      await this.updateProjectTaskCount(task.project_id);
    }

    return deletedTask;
  }

  findAll() {
    return this.prisma.t_task.findMany();
  }

  findOne(id: number) {
    return this.prisma.t_task.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    // If project_id is being updated, we need to update counts for both old and new projects
    if (updateTaskDto.project_id !== undefined) {
      const task = await this.prisma.t_task.findUnique({
        where: { id },
        select: { project_id: true },
      });

      const updatedTask = await this.prisma.t_task.update({
        where: { id },
        data: updateTaskDto,
      });

      // Update task counts for both old and new projects
      const updatePromises = [];
      if (task?.project_id) {
        updatePromises.push(this.updateProjectTaskCount(task.project_id));
      }
      if (updateTaskDto.project_id) {
        updatePromises.push(
          this.updateProjectTaskCount(updateTaskDto.project_id),
        );
      }

      await Promise.all(updatePromises);
      return updatedTask;
    }

    return this.prisma.t_task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  findAllByProjectId(projectId: number) {
    return this.prisma.t_task.findMany({
      where: { project_id: projectId },
    });
  }
}
