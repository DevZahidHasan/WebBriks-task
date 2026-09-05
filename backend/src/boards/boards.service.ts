import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Board, BoardMember, BoardRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AddMemberDto } from './dto/add-member.dto';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateBoardDto): Promise<Board> {
    return this.prisma.board.create({
      data: {
        title: dto.title.trim(),
        description: dto.description?.trim(),
        ownerId: userId,
        members: {
          create: {
            userId,
            role: BoardRole.OWNER,
          },
        },
      },
    });
  }

  async findAllForUser(userId: string): Promise<
    (Board & {
      role: BoardRole;
      _count: { columns: number; members: number };
      owner: { id: string; name: string; email: string };
    })[]
  > {
    const memberships = await this.prisma.boardMember.findMany({
      where: { userId },
      include: {
        board: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            _count: {
              select: {
                columns: true,
                members: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return memberships.map((membership) => ({
      ...membership.board,
      role: membership.role,
    }));
  }

  async findById(boardId: string) {
    const board = await this.prisma.board.findUnique({
      where: { id: boardId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        members: {
          select: {
            id: true,
            role: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        columns: {
          orderBy: {
            position: 'asc',
          },
          include: {
            tasks: {
              orderBy: {
                position: 'asc',
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
            },
          },
        },
      },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    return board;
  }

  async update(boardId: string, dto: UpdateBoardDto): Promise<Board> {
    return this.prisma.board.update({
      where: { id: boardId },
      data: {
        ...(dto.title !== undefined ? { title: dto.title.trim() } : {}),
        ...(dto.description !== undefined ? { description: dto.description?.trim() } : {}),
      },
    });
  }

  async delete(boardId: string): Promise<{ success: boolean; id: string }> {
    await this.prisma.board.delete({
      where: { id: boardId },
    });

    return { success: true, id: boardId };
  }

  async addMember(boardId: string, dto: AddMemberDto): Promise<BoardMember> {
    const normalizedEmail = dto.email.trim().toLowerCase();

    const targetUser = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!targetUser) {
      throw new NotFoundException('No user found with the provided email address');
    }

    const existingMember = await this.prisma.boardMember.findUnique({
      where: {
        boardId_userId: {
          boardId,
          userId: targetUser.id,
        },
      },
    });

    if (existingMember) {
      throw new ConflictException('This user is already a member of this board');
    }

    return this.prisma.boardMember.create({
      data: {
        boardId,
        userId: targetUser.id,
        role: dto.role,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async removeMember(
    boardId: string,
    memberUserId: string,
    requestingUserId: string,
  ): Promise<{ success: boolean }> {
    const targetMember = await this.prisma.boardMember.findUnique({
      where: {
        boardId_userId: {
          boardId,
          userId: memberUserId,
        },
      },
    });

    if (!targetMember) {
      throw new NotFoundException('Member not found on this board');
    }

    if (targetMember.role === BoardRole.OWNER) {
      throw new ForbiddenException('The board owner cannot be removed from the board');
    }

    // Only OWNER can remove other members, but any member can remove themselves (leave board)
    if (memberUserId !== requestingUserId) {
      const requester = await this.prisma.boardMember.findUnique({
        where: {
          boardId_userId: {
            boardId,
            userId: requestingUserId,
          },
        },
      });

      if (!requester || requester.role !== BoardRole.OWNER) {
        throw new ForbiddenException('Only the board owner can remove other members');
      }
    }

    await this.prisma.boardMember.delete({
      where: {
        boardId_userId: {
          boardId,
          userId: memberUserId,
        },
      },
    });

    return { success: true };
  }
}
