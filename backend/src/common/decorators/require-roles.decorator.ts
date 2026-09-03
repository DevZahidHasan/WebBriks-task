import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { BoardRole } from '@prisma/client';

export const REQUIRED_ROLES_KEY = 'requiredRoles';
export const RequireRoles = (...roles: BoardRole[]): CustomDecorator<string> =>
  SetMetadata(REQUIRED_ROLES_KEY, roles);
