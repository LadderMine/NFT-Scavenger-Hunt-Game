import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsEnum, IsOptional, IsObject, IsDateString } from 'class-validator';
import { AssetType } from '../entities/inventory';

export class AssetDetailDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  iconUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  rarity?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  achievementType?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class InventoryItemDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty({ enum: AssetType })
  @IsEnum(AssetType)
  assetType: AssetType;

  @ApiProperty()
  @IsDateString()
  acquiredAt: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  acquisitionContext?: Record<string, any>;

  @ApiProperty()
  assetDetails: AssetDetailDto;
}

export class UserInventoryResponseDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty({ type: [InventoryItemDto] })
  inventory: InventoryItemDto[];

  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  nftCount: number;

  @ApiProperty()
  badgeCount: number;
}