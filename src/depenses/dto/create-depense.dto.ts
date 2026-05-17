import { IsString, IsNumber, IsPositive, Matches, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDepenseDto {
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date doit être YYYY-MM-DD' })
  date: string;

  @IsString()
  @MinLength(1)
  category: string;

  @IsString()
  @MinLength(1)
  name: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  amount: number;
}
