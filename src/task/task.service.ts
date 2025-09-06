import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskRepo } from './task.repo';
import { Logger } from '@nestjs/common';
import { ProjectRepo } from '../project/project.repo';
import { GetTaskDto } from './dto/get-task.dto';
import { TaskActivityRepo } from '../task-activity/task-activity.repo';
import { TaskStatus } from '@prisma/client';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);
  constructor(
    private taskRepo: TaskRepo,
    private projectRepo: ProjectRepo,
    private taskActivityRepo: TaskActivityRepo,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    const project = await this.projectRepo.findOne(createTaskDto.project_id);
    if (!project) {
      throw new NotFoundException(
        `Project with ID ${createTaskDto.project_id}`,
      );
    }

    try {
      // First create the task to get its ID
      const task = await this.taskRepo.create(createTaskDto);

      // Then create the task activity with the task's ID
      await this.taskActivityRepo.create({
        task_id: task.id, // Use the created task's ID
        start_time: null,
        status: createTaskDto.status,
        // Provide default values for required fields
        end_time: null,
        duration: 0,
        percentage: 0,
        notes: 'Task created',
        created_by: 'system', // Or get this from the authenticated user
      });

      // Update the project's task count
      await this.taskRepo.addCount(
        createTaskDto.project_id,
        createTaskDto.status,
      );

      return task;
    } catch (error) {
      this.logger.error(`Failed to create task: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to create task: ${error.message}`);
    }
  }

  async findAll(query: GetTaskDto) {
    try {
      return await this.taskRepo.findAll(query);
    } catch (error) {
      this.logger.error(`Failed to fetch tasks: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to fetch tasks');
    }
  }

  async findOne(id: number) {
    try {
      const task = await this.taskRepo.findOne(id);
      if (!task) {
        throw new NotFoundException(`Task with ID ${id}`);
      }
      return task;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to fetch task ${id}: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(`Failed to fetch task with ID ${id}`);
    }
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    try {
      // Always fetch the existing task first
      const existing = await this.taskRepo.findOne(id);
      if (!existing) {
        throw new NotFoundException(`Task with ID ${id}`);
      }

      // Calculate progress percentage based on time elapsed
      const now = new Date();
      let progress = 0;
      let isOverdue = false;

      if (existing.start_date && existing.end_date) {
        const start = new Date(existing.start_date).getTime();
        const end = new Date(existing.end_date).getTime();
        const current = now.getTime();

        if (current >= start) {
          // Calculate percentage of time elapsed
          const totalDuration = end - start;
          const elapsed = Math.max(0, current - start);
          progress = Math.min(100, Math.round((elapsed / totalDuration) * 100));

          // Check if task is overdue
          isOverdue = current > end;
        }
      }

      // Derive projectId and status if not provided in DTO
      const projectId = updateTaskDto.project_id;
      if (!projectId) {
        throw new BadRequestException('project_id is required for task update');
      }

      if (updateTaskDto.isUpdateStatus) {
        const status = updateTaskDto.status;
        const updateData: any = {
          status: status,
          percentage: progress,
          notes: isOverdue ? 'Task is overdue' : 'In progress',
        };

        if (status === TaskStatus.IN_PROGRESS) {
          updateData.start_time = now;
        } else if (status === TaskStatus.DONE) {
          progress = 100;
          updateData.end_time = now;
          updateData.percentage = progress;
          updateData.duration = Math.round(
            (now.getTime() -
              new Date(existing.activities[0].start_time).getTime()) /
              (1000 * 60),
          ); // in minutes
          updateData.notes = 'Task completed';
        }

        await this.taskActivityRepo.findAndUpdate(id, updateData);
        await this.taskRepo.addCount(projectId, status);
      }

      // Update task progress
      const updatedTask = await this.taskRepo.update(id, {
        ...updateTaskDto,
        progress: progress,
      });

      return updatedTask;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to update task ${id}: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(`Failed to update task: ${error.message}`);
    }
  }

  async remove(id: number, projectId?: number) {
    try {
      // Check if task exists
      const exists = await this.taskRepo.findOne(id, projectId);
      if (!exists) {
        throw new NotFoundException(`Task with ID ${id}`);
      }

      return await this.taskRepo.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to delete task ${id}: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(`Failed to delete task with ID ${id}`);
    }
  }

  async findAllByProjectId(projectId: number) {
    try {
      const project = await this.projectRepo.findOne(projectId);
      if (!project) {
        throw new NotFoundException(`Project with ID ${projectId}`);
      }

      return await this.taskRepo.findAllByProjectId(projectId);
    } catch (error) {
      this.logger.error(
        `Failed to fetch tasks by project ID ${projectId}: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to fetch tasks by project ID ${projectId}`,
      );
    }
  }

  async findAllByStatus() {
    try {
      return await this.taskRepo.findAllByStatus();
    } catch (error) {
      this.logger.error(
        `Failed to fetch tasks by status: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(`Failed to fetch tasks by status`);
    }
  }
}
