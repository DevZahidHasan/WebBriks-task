import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BoardRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequireRoles } from '../common/decorators/require-roles.decorator';
import { BoardAccessGuard } from '../common/guards/board-access.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { MoveTaskDto } from './dto/move-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@UseGuards(JwtAuthGuard, BoardAccessGuard)
@RequireRoles(BoardRole.OWNER, BoardRole.MEMBER)
@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('columns/:columnId/tasks')
  async create(@Param('columnId') columnId: string, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(columnId, dto);
  }

  @Patch('tasks/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update(id, dto);
  }

  @Patch('tasks/:id/move')
  async move(@Param('id') id: string, @Body() dto: MoveTaskDto) {
    return this.tasksService.move(id, dto);
  }

  @Delete('tasks/:id')
  async delete(@Param('id') id: string) {
    return this.tasksService.delete(id);
  }
}
