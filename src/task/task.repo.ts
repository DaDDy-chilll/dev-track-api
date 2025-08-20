import { Injectable } from '@nestjs/common';
import { PrismaClient, TaskStatus } from '@prisma/client';
import { endOfMonth, startOfMonth } from 'date-fns';
import { formatInTimeZone, toDate } from 'date-fns-tz';
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

  findOne(id: number, projectId?: number) {
    return this.prisma.t_task.findUnique({
      where: { id, project_id: projectId },
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

  async deleteByProjectId(projectId: number) {
    try {
      // Delete all tasks associated with the project
      const result = await this.prisma.t_task.deleteMany({
        where: { project_id: projectId },
      });

      // Update the project's task count to 0 since all tasks are deleted
      await this.prisma.m_project.update({
        where: { id: projectId },
        data: { task_count: 0 },
      });

      return result;
    } catch (error) {
      throw new Error(
        `Failed to delete tasks for project ${projectId}: ${error.message}`,
      );
    }
  }

  async addCount(projectId: number, status: TaskStatus) {
    // Get current time in Myanmar Time (UTC+6:30)
    const myanmarTimeZone = 'Asia/Yangon';
    const now = new Date();
    const myanmarDate = toDate(now, { timeZone: myanmarTimeZone });

    const start = startOfMonth(myanmarDate);
    const end = endOfMonth(myanmarDate);

    // Format dates for database query (in Myanmar Time)
    const formatForDB = "yyyy-MM-dd'T'HH:mm:ss.SSSxxx";
    const startStr = formatInTimeZone(start, myanmarTimeZone, formatForDB);
    const endStr = formatInTimeZone(end, myanmarTimeZone, formatForDB);

    const existing = await this.prisma.t_project_task_status.findFirst({
      where: {
        project_id: projectId,
        status: status,
        date: {
          gte: new Date(startStr),
          lte: new Date(endStr),
        },
      },
    });

    if (existing) {
      return this.prisma.t_project_task_status.update({
        where: { id: existing.id },
        data: {
          count: { increment: 1 },
          date: now,
        },
      });
    }

    // If not exists or from previous month, create a new record
    return this.prisma.t_project_task_status.create({
      data: {
        project_id: projectId,
        status,
        count: 1,
        date: now,
        month: formatInTimeZone(now, myanmarTimeZone, 'yyyy-MM'),
      },
    });
  }
}
