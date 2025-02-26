import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateNFTDto {
  @IsNumber()
  @IsNotEmpty()
  puzzlesId: number;
}

export class UpdateNFTDto {
  @IsNumber()
  @IsNotEmpty()
  puzzlesId: number;
}
