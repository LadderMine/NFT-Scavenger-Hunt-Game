import { ApiProperty } from "@nestjs/swagger"

export class MaintenanceStatusDto {
  @ApiProperty({
    description: "Current maintenance mode status",
    example: true,
  })
  isMaintenanceMode: boolean

  @ApiProperty({
    description: "Maintenance message",
    example: "System is under maintenance. Please try again later.",
    nullable: true,
  })
  maintenanceMessage: string | null

  @ApiProperty({
    description: "Scheduled maintenance start time",
    example: "2024-01-15T02:00:00Z",
    nullable: true,
  })
  scheduledStart: Date | null

  @ApiProperty({
    description: "Scheduled maintenance end time",
    example: "2024-01-15T04:00:00Z",
    nullable: true,
  })
  scheduledEnd: Date | null

  @ApiProperty({
    description: "Admin who enabled maintenance",
    example: "admin_user",
    nullable: true,
  })
  enabledByUsername: string | null

  @ApiProperty({
    description: "Reason for maintenance",
    example: "Database migration and system updates",
    nullable: true,
  })
  reason: string | null

  @ApiProperty({
    description: "When maintenance was last updated",
    example: "2024-01-15T01:30:00Z",
  })
  updatedAt: Date
}
