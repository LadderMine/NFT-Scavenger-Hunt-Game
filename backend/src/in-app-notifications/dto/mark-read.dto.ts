import { IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MarkReadDto {
  @ApiProperty({ description: 'Array of notification IDs to mark as read', type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  notificationIds: number[];
}