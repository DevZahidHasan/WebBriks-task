import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class MoveTaskDto {
  @IsString({ message: 'Target column ID must be a string' })
  @IsNotEmpty({ message: 'Target column ID is required' })
  targetColumnId!: string;

  @IsInt({ message: 'New position index must be an integer' })
  @Min(0, { message: 'New position index cannot be negative' })
  newPositionIndex!: number;
}
