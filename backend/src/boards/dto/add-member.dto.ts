import { BoardRole } from '@prisma/client';
import { IsEmail, IsEnum } from 'class-validator';

export class AddMemberDto {
  @IsEmail({}, { message: 'Invalid email address format' })
  email!: string;

  @IsEnum(BoardRole, {
    message: 'Role must be either MEMBER or VIEWER (OWNER is reserved for board creator)',
  })
  role!: BoardRole;
}
