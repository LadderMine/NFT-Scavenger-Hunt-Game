import { IsString, IsNumber, IsBoolean } from 'class-validator';

export class CreateSubscriptionDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  duration: string; // "monthly" or "yearly"

  @IsBoolean()
  isActive: boolean;
}
