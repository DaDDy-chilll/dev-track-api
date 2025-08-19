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

  findAllStatus() {
    return this.prisma.m_project.findMany({
      select: {
        id: true,
        name: true,
        status: true,
        color: true,
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.m_project.findMany({
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
        image: true, // Include the related image
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  findOne(id: number) {
    return this.prisma.m_project.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
        image: true, // Include the related image
      },
    });
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return this.prisma.m_project.update({
      where: { id },
      data: updateProjectDto,
    });
  }

  remove(id: number) {
    return this.prisma.m_project.delete({
      where: { id },
    });
  }
}
