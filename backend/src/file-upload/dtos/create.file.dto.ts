import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateFileDto {
  @IsString()
  @IsNotEmpty()
  filename: string;

  @IsString()
  @IsNotEmpty()
  path: string;

  @IsString()
  @IsNotEmpty()
  mimetype: string;

  @IsNumber()
  @IsNotEmpty()
  size: number;

  @IsString()
  @IsOptional()
  originalName?: string;

  @IsString()
  @IsNotEmpty()
  storageType: string;
}