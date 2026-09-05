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
import { ColumnsService } from './columns.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@UseGuards(JwtAuthGuard, BoardAccessGuard)
@RequireRoles(BoardRole.OWNER, BoardRole.MEMBER)
@Controller()
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Post('boards/:boardId/columns')
  async create(@Param('boardId') boardId: string, @Body() dto: CreateColumnDto) {
    return this.columnsService.create(boardId, dto);
  }

  @Patch('columns/:columnId')
  async update(@Param('columnId') columnId: string, @Body() dto: UpdateColumnDto) {
    return this.columnsService.update(columnId, dto);
  }

  @Delete('columns/:columnId')
  async delete(@Param('columnId') columnId: string) {
    return this.columnsService.delete(columnId);
  }
}
