import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateColumnDto {
  @IsString({ message: 'Title must be a string' })
  @MinLength(1, { message: 'Title must be at least 1 character long' })
  @MaxLength(50, { message: 'Title must be at most 50 characters long' })
  title!: string;
}
