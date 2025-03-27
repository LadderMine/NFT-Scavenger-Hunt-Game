import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator"

export class RequestPayoutDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number

  @IsOptional()
  @IsString()
  paymentMethod?: string
}

