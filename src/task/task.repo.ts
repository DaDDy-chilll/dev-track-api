import { Injectable } from '@nestjs/common';
import { PrismaClient, TaskStatus } from '@prisma/client';
import { endOfMonth, startOfMonth } from 'date-fns';
import { formatInTimeZone, toDate } from 'date-fns-tz';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTaskDto } from './dto/get-task.dto';
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
        category: createTaskDto.category,
        branch_name: createTaskDto.branch_name,
        start_date: createTaskDto.start_date,
        end_date: createTaskDto.end_date,
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

  async findAll(query: GetTaskDto) {
    const where: any = {};

    // Handle date range filter
    if (query.start_date && query.end_date) {
      const startDate = new Date(query.start_date);
      startDate.setUTCHours(0, 0, 0, 0);

      const endDate = new Date(query.end_date);
      endDate.setUTCHours(23, 59, 59, 999);

      where.start_date = {
        lte: endDate,
      };
      where.end_date = {
        gte: startDate,
      };
    }

    // Handle status filter
    if (query.status && query.status.length > 0) {
      const statuses = Array.isArray(query.status)
        ? query.status
        : query.status.split(',');
      where.status = {
        in: statuses,
      };
    }

    // Add other filters
    if (query.name) {
      where.name = {
        contains: query.name,
      };
    }
    if (query.priority) {
      where.priority = query.priority;
    }
    if (query.projectId) {
      where.project_id = +query.projectId;
    }
    if (query.category) {
      where.category = query.category;
    }
    if (query.branch_name) {
      where.branch_name = query.branch_name;
    }

    return this.prisma.t_task.findMany({
      where,
      include: {
        project: true,
        activities: true,
      },
    });
  }

  findOne(id: number, projectId?: number) {
    return this.prisma.t_task.findUnique({
      where: { id, project_id: projectId },
      include: {
        project: true,
        activities: true,
      },
    });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    // If project_id is being updated, we need to update counts for both old and new projects

    const updatedTask = await this.prisma.t_task.update({
      where: { id },
      data: {
        name: updateTaskDto.name,
        priority: updateTaskDto.priority,
        status: updateTaskDto.status,
        due_time: updateTaskDto.due_time,
        project_id: updateTaskDto.project_id,
        progress: updateTaskDto.progress,
        category: updateTaskDto.category,
        branch_name: updateTaskDto.branch_name,
        start_date: updateTaskDto.start_date,
        end_date: updateTaskDto.end_date,
      },
    });

    return updatedTask;
  }

  findAllByProjectId(projectId: number) {
    return this.prisma.t_task.findMany({
      where: { project_id: projectId },
    });
  }

  findAllByStatus() {
    return this.prisma.t_project_task_status.groupBy({
      by: ['status'],
      _sum: {
        count: true,
      },
    });
  }

  async deleteByProjectId(projectId: number) {
    try {
      // Delete all tasks associated with the project
      const result = await this.prisma.t_task.deleteMany({
        where: { project_id: projectId },
      });

      await this.prisma.t_project_task_status.deleteMany({
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
