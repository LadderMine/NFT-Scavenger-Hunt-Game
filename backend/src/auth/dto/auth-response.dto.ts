import { ApiProperty } from "@nestjs/swagger"

// Step 1: Create a nested DTO for the user
export class UserDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  email: string

  @ApiProperty()
  createdAt: Date
}

// Step 2: Use UserDto in your response
export class AuthResponseDto {
  @ApiProperty({
    description: "JWT access token",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  })
  accessToken: string

  @ApiProperty({
    description: "Token type",
    example: "Bearer",
  })
  tokenType: string

  @ApiProperty({
    description: "Token expiration time in seconds",
    example: 900,
  })
  expiresIn: number

  @ApiProperty({
    description: "User information",
    type: () => UserDto,
  })
  user: UserDto
}
