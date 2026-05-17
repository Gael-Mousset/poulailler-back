import { IsString, IsInt, IsNumber, Min, IsPositive, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVenteDto {
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date doit être YYYY-MM-DD' })
  date: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  oeufs: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  montant: number;
}
