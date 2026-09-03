import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SanitizedUser } from '../dto/auth-response.dto';

export const CurrentUser = createParamDecorator(
  (data: keyof SanitizedUser | undefined, ctx: ExecutionContext): SanitizedUser | string | Date => {
    const request = ctx.switchToHttp().getRequest<{ user: SanitizedUser }>();
    const user = request.user;

    if (!user) {
      throw new Error('CurrentUser decorator used without JwtAuthGuard');
    }

    return data ? user[data] : user;
  },
);
