import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Task } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { MoveTaskDto } from './dto/move-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(columnId: string, dto: CreateTaskDto): Promise<Task> {
    const lastTask = await this.prisma.task.findFirst({
      where: { columnId },
      orderBy: { position: 'desc' },
      select: { position: true },
    });

    const nextPosition = lastTask !== null ? lastTask.position + 1 : 0;

    return this.prisma.task.create({
      data: {
        title: dto.title.trim(),
        description: dto.description?.trim(),
        position: nextPosition,
        priority: dto.priority,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        assigneeId: dto.assigneeId || null,
        columnId,
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async update(taskId: string, dto: UpdateTaskDto): Promise<Task> {
    const existing = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existing) {
      throw new NotFoundException('Task not found');
    }

    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        ...(dto.title !== undefined ? { title: dto.title.trim() } : {}),
        ...(dto.description !== undefined ? { description: dto.description?.trim() } : {}),
        ...(dto.priority !== undefined ? { priority: dto.priority } : {}),
        ...(dto.dueDate !== undefined ? { dueDate: dto.dueDate ? new Date(dto.dueDate) : null } : {}),
        ...(dto.assigneeId !== undefined ? { assigneeId: dto.assigneeId || null } : {}),
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async delete(taskId: string): Promise<{ success: boolean; id: string }> {
    return this.prisma.$transaction(async (tx) => {
      const task = await tx.task.findUnique({
        where: { id: taskId },
      });

      if (!task) {
        throw new NotFoundException('Task not found');
      }

      await tx.task.delete({
        where: { id: taskId },
      });

      // Shift subsequent tasks in the same column to maintain contiguous indexing
      await tx.task.updateMany({
        where: {
          columnId: task.columnId,
          position: { gt: task.position },
        },
        data: {
          position: { decrement: 1 },
        },
      });

      return { success: true, id: taskId };
    });
  }

  async move(taskId: string, dto: MoveTaskDto): Promise<Task> {
    return this.prisma.$transaction(async (tx) => {
      const task = await tx.task.findUnique({
        where: { id: taskId },
        include: { column: true },
      });

      if (!task) {
        throw new NotFoundException('Task not found');
      }

      const targetColumn = await tx.column.findUnique({
        where: { id: dto.targetColumnId },
      });

      if (!targetColumn) {
        throw new NotFoundException('Target column not found');
      }

      if (targetColumn.boardId !== task.column.boardId) {
        throw new BadRequestException('Cannot move tasks across different boards');
      }

      const isSameColumn = task.columnId === dto.targetColumnId;

      if (isSameColumn) {
        // Count total tasks in the current column
        const columnTasksCount = await tx.task.count({
          where: { columnId: task.columnId },
        });

        const clampedPosition = Math.max(0, Math.min(dto.newPositionIndex, columnTasksCount - 1));

        if (clampedPosition === task.position) {
          // No movement needed, position is unchanged
          return task;
        }

        if (clampedPosition > task.position) {
          // Moving DOWN: Shift tasks between (currentPosition + 1) and clampedPosition UP (decrement position)
          await tx.task.updateMany({
            where: {
              columnId: task.columnId,
              position: {
                gt: task.position,
                lte: clampedPosition,
              },
            },
            data: {
              position: { decrement: 1 },
            },
          });
        } else {
          // Moving UP: Shift tasks between clampedPosition and (currentPosition - 1) DOWN (increment position)
          await tx.task.updateMany({
            where: {
              columnId: task.columnId,
              position: {
                gte: clampedPosition,
                lt: task.position,
              },
            },
            data: {
              position: { increment: 1 },
            },
          });
        }

        return tx.task.update({
          where: { id: taskId },
          data: { position: clampedPosition },
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        });
      } else {
        // CROSS-COLUMN MOVE
        // 1. Shift remaining tasks in source column down (fill gap left by departing task)
        await tx.task.updateMany({
          where: {
            columnId: task.columnId,
            position: { gt: task.position },
          },
          data: {
            position: { decrement: 1 },
          },
        });

        // 2. Count tasks in target column to clamp index
        const targetTasksCount = await tx.task.count({
          where: { columnId: dto.targetColumnId },
        });

        const clampedPosition = Math.max(0, Math.min(dto.newPositionIndex, targetTasksCount));

        // 3. Shift tasks in target column at or after target position up (make room for arriving task)
        await tx.task.updateMany({
          where: {
            columnId: dto.targetColumnId,
            position: { gte: clampedPosition },
          },
          data: {
            position: { increment: 1 },
          },
        });

        // 4. Move task to target column with clamped position
        return tx.task.update({
          where: { id: taskId },
          data: {
            columnId: dto.targetColumnId,
            position: clampedPosition,
          },
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        });
      }
    });
  }
}

