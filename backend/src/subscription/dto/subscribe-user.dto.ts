import { IsNumber } from 'class-validator';

export class SubscribeUserDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  subscriptionId: number;
}
