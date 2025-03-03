import { IsNotEmpty, IsInt } from 'class-validator';

export class CreateOrderitemDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @IsInt()
  @IsNotEmpty()
  produitId: number;
}
