import { TaskStatus } from '@prisma/client';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTaskActivityDto {
  @IsNumber()
  @IsOptional()
  task_id: number;

  @IsDate()
  @IsOptional()
  start_time: Date;

  @IsDate()
  @IsOptional()
  end_time: Date;

  @IsNumber()
  @IsOptional()
  duration: number;

  @IsNumber()
  @IsOptional()
  percentage: number;

  @IsString()
  @IsOptional()
  status: TaskStatus;

  @IsString()
  @IsOptional()
  notes: string;

  @IsString()
  @IsOptional()
  created_by: string;
}
