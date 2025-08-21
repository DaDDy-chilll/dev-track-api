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

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);
  constructor(
    private taskRepo: TaskRepo,
    private projectRepo: ProjectRepo,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    const project = await this.projectRepo.findOne(createTaskDto.project_id);
    if (!project) {
      throw new NotFoundException(
        `Project with ID ${createTaskDto.project_id}`,
      );
    }
    try {
      await this.taskRepo.addCount(
        createTaskDto.project_id,
        createTaskDto.status,
      );
      return await this.taskRepo.create(createTaskDto);
    } catch (error) {
      this.logger.error(`Failed to create task: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to create task: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await this.taskRepo.findAll();
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

      // Derive projectId and status if not provided in DTO
      const projectId = updateTaskDto.project_id ?? existing.project_id;
      if (!projectId) {
        throw new BadRequestException('project_id is required for task update');
      }
      const status = updateTaskDto.status ?? existing.status;

      await this.taskRepo.addCount(projectId, status);

      return await this.taskRepo.update(id, updateTaskDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to update task ${id}: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(`Failed to update task with ID ${id}`);
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
}
