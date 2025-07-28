import {
  IsString,
  IsInt,
  IsOptional,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { ProjectStatus } from '@prisma/client';

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsInt()
  @IsOptional()
  image_id?: number;

  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @IsString()
  @IsOptional()
  color?: string;

  @IsBoolean()
  @IsOptional()
  isNew?: boolean;
}
