import { Injectable, NotFoundException } from '@nestjs/common';
import { Column } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@Injectable()
export class ColumnsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(boardId: string, dto: CreateColumnDto): Promise<Column> {
    const lastColumn = await this.prisma.column.findFirst({
      where: { boardId },
      orderBy: { position: 'desc' },
      select: { position: true },
    });

    const nextPosition = lastColumn !== null ? lastColumn.position + 1 : 0;

    return this.prisma.column.create({
      data: {
        title: dto.title.trim(),
        position: nextPosition,
        boardId,
      },
      include: {
        tasks: {
          orderBy: { position: 'asc' },
        },
      },
    });
  }

  async update(columnId: string, dto: UpdateColumnDto): Promise<Column> {
    const existing = await this.prisma.column.findUnique({
      where: { id: columnId },
    });

    if (!existing) {
      throw new NotFoundException('Column not found');
    }

    return this.prisma.column.update({
      where: { id: columnId },
      data: {
        title: dto.title.trim(),
      },
      include: {
        tasks: {
          orderBy: { position: 'asc' },
        },
      },
    });
  }

  async delete(columnId: string): Promise<{ success: boolean; id: string }> {
    const existing = await this.prisma.column.findUnique({
      where: { id: columnId },
    });

    if (!existing) {
      throw new NotFoundException('Column not found');
    }

    await this.prisma.column.delete({
      where: { id: columnId },
    });

    return { success: true, id: columnId };
  }
}
