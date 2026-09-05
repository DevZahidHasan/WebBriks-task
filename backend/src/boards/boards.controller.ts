import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BoardRole } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequireRoles } from '../common/decorators/require-roles.decorator';
import { BoardAccessGuard } from '../common/guards/board-access.guard';
import { BoardsService } from './boards.service';
import { AddMemberDto } from './dto/add-member.dto';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@UseGuards(JwtAuthGuard)
@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateBoardDto) {
    return this.boardsService.create(userId, dto);
  }

  @Get()
  async findAll(@CurrentUser('id') userId: string) {
    return this.boardsService.findAllForUser(userId);
  }

  @UseGuards(BoardAccessGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.boardsService.findById(id);
  }

  @UseGuards(BoardAccessGuard)
  @RequireRoles(BoardRole.OWNER, BoardRole.MEMBER)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateBoardDto) {
    return this.boardsService.update(id, dto);
  }

  @UseGuards(BoardAccessGuard)
  @RequireRoles(BoardRole.OWNER)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.boardsService.delete(id);
  }

  @UseGuards(BoardAccessGuard)
  @RequireRoles(BoardRole.OWNER, BoardRole.MEMBER)
  @Post(':id/members')
  async addMember(@Param('id') id: string, @Body() dto: AddMemberDto) {
    return this.boardsService.addMember(id, dto);
  }

  @UseGuards(BoardAccessGuard)
  @Delete(':id/members/:userId')
  async removeMember(
    @Param('id') id: string,
    @Param('userId') memberUserId: string,
    @CurrentUser('id') requestingUserId: string,
  ) {
    return this.boardsService.removeMember(id, memberUserId, requestingUserId);
  }
}
