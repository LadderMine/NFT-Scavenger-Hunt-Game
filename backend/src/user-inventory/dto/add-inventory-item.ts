import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsEnum, IsOptional, IsObject } from 'class-validator';
import { AssetType } from '../entities/inventory'; 

export class AddInventoryItemDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsUUID()
  assetId: string;

  @ApiProperty({ enum: AssetType })
  @IsEnum(AssetType)
  assetType: AssetType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  acquisitionContext?: Record<string, any>;
}