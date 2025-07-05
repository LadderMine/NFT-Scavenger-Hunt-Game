import { IsIP, IsNotEmpty } from 'class-validator';

export class CreateGeoStatDto {
  @IsNotEmpty()
  @IsIP()
  ipAddress: string;
}