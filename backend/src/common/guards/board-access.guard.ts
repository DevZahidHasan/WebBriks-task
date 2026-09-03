import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BoardMember, BoardRole } from '@prisma/client';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { SanitizedUser } from '../../auth/dto/auth-response.dto';
import { REQUIRED_ROLES_KEY } from '../decorators/require-roles.decorator';

export interface AuthenticatedBoardRequest extends Request {
  user: SanitizedUser;
  boardMember?: BoardMember;
  resolvedBoardId?: string;
}

@Injectable()
export class BoardAccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedBoardRequest>();
    const user = request.user;

    if (!user || !user.id) {
      throw new ForbiddenException('User authentication required before board authorization');
    }

    const boardId = await this.resolveBoardId(request);
    if (!boardId) {
      throw new BadRequestException('Unable to resolve board context for authorization');
    }

    const member = await this.prisma.boardMember.findUnique({
      where: {
        boardId_userId: {
          boardId,
          userId: user.id,
        },
      },
    });

    if (!member) {
      throw new ForbiddenException('Access denied: You are not a member of this board');
    }

    const requiredRoles = this.reflector.getAllAndOverride<BoardRole[] | undefined>(
      REQUIRED_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (requiredRoles && requiredRoles.length > 0) {
      if (!requiredRoles.includes(member.role)) {
        throw new ForbiddenException(
          `Action requires one of the following roles: [${requiredRoles.join(', ')}]. Current role: ${member.role}`,
        );
      }
    }

    request.boardMember = member;
    request.resolvedBoardId = boardId;

    return true;
  }

  private async resolveBoardId(request: AuthenticatedBoardRequest): Promise<string | null> {
    const params = request.params as Record<string, string | undefined>;

    if (params.boardId) {
      return params.boardId;
    }

    // Check if the route is /boards/:id
    const routePath = request.route?.path as string | undefined;
    if (params.id && routePath && routePath.includes('/boards/:id')) {
      return params.id;
    }

    // If columnId is present, resolve its boardId
    if (params.columnId) {
      const column = await this.prisma.column.findUnique({
        where: { id: params.columnId },
        select: { boardId: true },
      });
      if (!column) {
        throw new NotFoundException('Target column not found');
      }
      return column.boardId;
    }

    // If taskId is present, resolve its column's boardId
    if (params.taskId || (params.id && routePath && routePath.includes('/tasks/:id'))) {
      const targetTaskId = params.taskId || params.id;
      const task = await this.prisma.task.findUnique({
        where: { id: targetTaskId },
        select: {
          column: {
            select: { boardId: true },
          },
        },
      });
      if (!task) {
        throw new NotFoundException('Target task not found');
      }
      return task.column.boardId;
    }

    return null;
  }
}
