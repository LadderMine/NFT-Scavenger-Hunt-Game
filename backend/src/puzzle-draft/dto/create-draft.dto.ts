import { IsNotEmpty, IsString, IsOptional, IsObject } from 'class-validator';

export class CreateDraftDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsObject()
  content: Record<string, any>;
}
