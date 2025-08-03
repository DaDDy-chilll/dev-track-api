import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';
import { ImageRepo } from './image.repo';

export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

@Injectable()
export class ImageService implements OnModuleInit {
  private readonly uploadDir = join(process.cwd(), 'uploads');

  constructor(
    private prisma: PrismaClient,
    private imageRepo: ImageRepo,
  ) {}

  onModuleInit() {
    // Create uploads directory if it doesn't exist
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  private getFileUrl(filename: string): string {
    return `/images/${filename}`;
  }

  async uploadImage(file: UploadedFile, projectId?: number) {
    // Create a unique filename
    const filename = `${Date.now()}-${file.originalname.replace(/[^\w\d.-]/g, '')}`;
    const filePath = join(this.uploadDir, filename);

    try {
      // Save file to disk
      writeFileSync(filePath, file.buffer);

      // Get URL for the file
      const fileUrl = this.getFileUrl(filename);

      // Save to database
      const image = await this.imageRepo.createImage({
        filename: file.originalname,
        mimetype: file.mimetype,
        url: fileUrl,
        projectId,
      });

      return {
        id: image.id,
        url: fileUrl,
        filename: file.originalname,
        mimetype: file.mimetype,
        projectId,
      };
    } catch (error) {
      // Clean up the file if database operation fails
      if (existsSync(filePath)) {
        unlinkSync(filePath);
      }
      throw error;
    }
  }

  async getImageById(id: number) {
    const image = await this.imageRepo.getImageById(id);
    if (!image) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }
    return image;
  }

  async deleteImage(id: number) {
    try {
      const image = await this.getImageById(id);
      const filePath = join(this.uploadDir, image.url.split('/').pop());

      // Delete from database
      await this.imageRepo.deleteImage(id);

      // Delete file
      if (existsSync(filePath)) {
        unlinkSync(filePath);
      }

      return { success: true, message: 'Image deleted successfully' };
    } catch (error) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }
  }
}
