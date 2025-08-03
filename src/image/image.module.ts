import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { PrismaClient } from '@prisma/client';
import { ImageRepo } from './image.repo';

@Module({
  controllers: [ImageController],
  providers: [PrismaClient, ImageRepo, ImageService],
  exports: [ImageService],
})
export class ImageModule {}
