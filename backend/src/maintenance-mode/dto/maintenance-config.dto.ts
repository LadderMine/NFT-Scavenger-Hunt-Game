import { IsBoolean, IsString, IsOptional, IsArray, IsUUID, IsDateString } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class UpdateMaintenanceConfigDto {
  @ApiProperty({
    description: "Enable or disable maintenance mode",
    example: true,
  })
  @IsBoolean()
  isMaintenanceMode: boolean

  @ApiPropertyOptional({
    description: "Message to display during maintenance",
    example: "System is under maintenance. Please try again later.",
  })
  @IsString()
  @IsOptional()
  maintenanceMessage?: string

  @ApiPropertyOptional({
    description: "Scheduled maintenance start time",
    example: "2024-01-15T02:00:00Z",
  })
  @IsDateString()
  @IsOptional()
  scheduledStart?: string

  @ApiPropertyOptional({
    description: "Scheduled maintenance end time",
    example: "2024-01-15T04:00:00Z",
  })
  @IsDateString()
  @IsOptional()
  scheduledEnd?: string

  @ApiPropertyOptional({
    description: "Admin user ID enabling maintenance",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsOptional()
  enabledBy?: string

  @ApiPropertyOptional({
    description: "Admin username enabling maintenance",
    example: "admin_user",
  })
  @IsString()
  @IsOptional()
  enabledByUsername?: string

  @ApiPropertyOptional({
    description: "Reason for maintenance",
    example: "Database migration and system updates",
  })
  @IsString()
  @IsOptional()
  reason?: string

  @ApiPropertyOptional({
    description: "Routes that should remain accessible during maintenance",
    example: ["/health", "/admin/*", "/auth/login"],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  allowedRoutes?: string[]

  @ApiPropertyOptional({
    description: "User IDs allowed during maintenance",
    example: ["123e4567-e89b-12d3-a456-426614174000"],
  })
  @IsArray()
  @IsUUID(4, { each: true })
  @IsOptional()
  allowedUserIds?: string[]

  @ApiPropertyOptional({
    description: "Block API routes during maintenance",
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  blockApiRoutes?: boolean

  @ApiPropertyOptional({
    description: "Block web routes during maintenance",
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  blockWebRoutes?: boolean
}
