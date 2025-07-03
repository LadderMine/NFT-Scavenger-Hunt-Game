import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateContentDto {
  @ApiProperty({ example: 'Introduction to Blockchain Technology' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({ example: 'Blockchain is a distributed ledger technology that enables secure, transparent, and tamper-proof record-keeping...' })
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiProperty({ example: 'blockchain', description: 'Topic category for the content' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  topic: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  isActive?: boolean;
} 