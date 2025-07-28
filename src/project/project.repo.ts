import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ProjectRepo {
  constructor(private prisma: PrismaClient) {}

  create(createProjectDto: CreateProjectDto) {
    return this.prisma.m_project.create({ data: createProjectDto });
  }

  findAll() {
    return this.prisma.m_project.findMany();
  }

  findOne(id: number) {
    return this.prisma.m_project.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return this.prisma.m_project.update({
      where: {
        id,
      },
      data: updateProjectDto,
    });
  }

  remove(id: number) {
    return this.prisma.m_project.delete({
      where: {
        id,
      },
    });
  }
}
