import { PartialType } from '@nestjs/swagger';
import { CreateTaskActivityDto } from './create-task-activity.dto';

export class UpdateTaskActivityDto extends PartialType(CreateTaskActivityDto) {}
