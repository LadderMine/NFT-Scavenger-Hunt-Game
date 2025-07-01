import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString, MinLength, MaxLength, Matches, IsNotEmpty } from "class-validator"

export class RegisterDto {
  @ApiProperty({
    description: "User full name",
    example: "John Doe",
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: "Name must be at least 2 characters long" })
  @MaxLength(100, { message: "Name must not exceed 100 characters" })
  name: string

  @ApiProperty({
    description: "Unique username for login",
    example: "johnny_doe",
    minLength: 3,
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: "Username must be at least 3 characters long" })
  @MaxLength(20, { message: "Username must not exceed 20 characters" })
  username: string

  @ApiProperty({
    description: "User email address",
    example: "john.doe@example.com",
  })
  @IsEmail({}, { message: "Please provide a valid email address" })
  @IsNotEmpty()
  email: string

  @ApiProperty({
    description:
      "User password (minimum 8 characters, must contain uppercase, lowercase, number, and special character)",
    example: "SecurePass123!",
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  })
  password: string
}
