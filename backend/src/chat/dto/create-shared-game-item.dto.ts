import { IsString, IsNotEmpty, IsOptional, IsObject } from "class-validator"

export class CreateSharedGameItemDto {
  @IsString()
  @IsNotEmpty()
  itemId: string

  @IsString()
  @IsNotEmpty()
  itemType: string

  @IsString()
  @IsNotEmpty()
  itemName: string

  @IsString()
  @IsOptional()
  itemRarity?: string

  @IsString()
  @IsOptional()
  itemImageUrl?: string

  @IsObject()
  @IsOptional()
  itemAttributes?: Record<string, any>
}

