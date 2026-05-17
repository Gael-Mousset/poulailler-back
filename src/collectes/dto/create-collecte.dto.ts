import { IsString, IsInt, Min, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCollecteDto {
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date doit être YYYY-MM-DD' })
  date: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  count: number;
}
