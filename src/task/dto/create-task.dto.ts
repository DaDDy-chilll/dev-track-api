import { TaskPriority, TaskStatus } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateTaskDto {
  @IsString()
  name: string;

  @IsISO8601()
  @Type(() => Date)
  duration: Date;

  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @IsInt()
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value) : null))
  project_id?: number;
}
