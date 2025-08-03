import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ImageRepo {
  constructor(private prisma: PrismaClient) {}

  async createImage(data: {
    filename: string;
    mimetype: string;
    url: string;
    projectId?: number;
  }) {
    return this.prisma.t_image.create({
      data: {
        filename: data.filename,
        mimetype: data.mimetype,
        url: data.url,
        ...(data.projectId && {
          project: {
            connect: { id: data.projectId },
          },
        }),
      },
    });
  }

  async getImageById(id: number) {
    return this.prisma.t_image.findUnique({
      where: { id },
    });
  }

  async deleteImage(id: number) {
    return this.prisma.t_image.delete({
      where: { id },
    });
  }
}
