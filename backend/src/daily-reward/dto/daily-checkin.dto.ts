import { IsNotEmpty, IsString } from 'class-validator';

export class DailyCheckinDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}