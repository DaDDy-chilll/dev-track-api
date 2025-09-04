import { TaskCategory, TaskPriority, TaskStatus } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class GetTaskDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsISO8601()
  @Type(() => Date)
  @IsOptional()
  due_time?: Date;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsInt()
  @IsOptional()
  progress?: number;

  @IsEnum(TaskCategory)
  @IsOptional()
  category?: TaskCategory;

  @IsString()
  @IsOptional()
  branch_name?: string;

  @IsInt()
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  projectId?: number;

  @IsISO8601()
  @Type(() => Date)
  @IsOptional()
  created_at?: Date;

  @IsISO8601()
  @Type(() => Date)
  @IsOptional()
  updated_at?: Date;

  @IsISO8601()
  @Type(() => Date)
  @IsOptional()
  start_date?: Date;

  @IsISO8601()
  @Type(() => Date)
  @IsOptional()
  end_date?: Date;
}
