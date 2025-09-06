import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaskActivityService } from './task-activity.service';
import { CreateTaskActivityDto } from './dto/create-task-activity.dto';
import { UpdateTaskActivityDto } from './dto/update-task-activity.dto';

@Controller('task-activity')
export class TaskActivityController {
  constructor(private readonly taskActivityService: TaskActivityService) {}

  @Post()
  create(@Body() createTaskActivityDto: CreateTaskActivityDto) {
    return this.taskActivityService.create(createTaskActivityDto);
  }

  @Get()
  findAll() {
    return this.taskActivityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskActivityService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskActivityDto: UpdateTaskActivityDto) {
    return this.taskActivityService.update(+id, updateTaskActivityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskActivityService.remove(+id);
  }
}
