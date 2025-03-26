import { IsUUID, IsNumber, IsNotEmpty, Min, IsString } from 'class-validator';

export class CreateRefundDto {
  @IsUUID()
  userId: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  @IsNotEmpty()
  reason: string;
}
