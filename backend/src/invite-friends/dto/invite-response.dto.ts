import { ApiProperty } from "@nestjs/swagger"
import { InviteStatus } from "../enums/invite-status.enum"

export class InviteResponseDto {
  @ApiProperty({
    description: "Unique identifier of the invitation",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  id: string

  @ApiProperty({
    description: "Email or phone of the invited person",
    example: "friend@example.com",
  })
  emailOrPhone: string

  @ApiProperty({
    description: "Unique token for the invitation",
    example: "abc123def456",
  })
  inviteToken: string

  @ApiProperty({
    description: "Status of the invitation",
    enum: InviteStatus,
    example: InviteStatus.PENDING,
  })
  status: InviteStatus

  @ApiProperty({
    description: "When the invitation was created",
    example: "2023-01-01T00:00:00Z",
  })
  createdAt: Date

  @ApiProperty({
    description: "When the invitation expires",
    example: "2023-01-08T00:00:00Z",
  })
  expiresAt: Date

  @ApiProperty({
    description: "Shareable link for the invitation",
    example: "https://yourapp.com/invite/abc123def456",
  })
  shareableLink?: string
}

