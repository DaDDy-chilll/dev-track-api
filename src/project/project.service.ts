import { Injectable, Logger } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectRepo } from './project.repo';
import {
  BadRequestException,
  NotFoundException,
} from '../common/exceptions/app.exception';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  constructor(private projectRepo: ProjectRepo) {}

  async create(createProjectDto: CreateProjectDto) {
    try {
      return await this.projectRepo.create(createProjectDto);
    } catch (error) {
      this.logger.error(
        `Failed to create project: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to create project: ${error.message}`,
      );
    }
  }

  async findAll() {
    try {
      return await this.projectRepo.findAll();
    } catch (error) {
      this.logger.error(
        `Failed to fetch projects: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to fetch projects');
    }
  }

  async findOne(id: number) {
    try {
      const project = await this.projectRepo.findOne(id);
      if (!project) {
        throw new NotFoundException(`Project with ID ${id}`);
      }
      return project;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to fetch project ${id}: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(`Failed to fetch project with ID ${id}`);
    }
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    try {
      // Check if project exists
      const exists = await this.projectRepo.findOne(id);
      if (!exists) {
        throw new NotFoundException(`Project with ID ${id}`);
      }

      return await this.projectRepo.update(id, updateProjectDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to update project ${id}: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(`Failed to update project with ID ${id}`);
    }
  }

  async remove(id: number) {
    try {
      // Check if project exists
      const exists = await this.projectRepo.findOne(id);
      if (!exists) {
        throw new NotFoundException(`Project with ID ${id}`);
      }

      return await this.projectRepo.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to delete project ${id}: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(`Failed to delete project with ID ${id}`);
    }
  }
}
