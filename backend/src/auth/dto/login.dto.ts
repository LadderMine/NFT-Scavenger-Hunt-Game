import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString, IsNotEmpty } from "class-validator"

export class LoginDto {
  @ApiProperty({
    description: "User email address",
    example: "john.doe@example.com",
  })
  @IsEmail({}, { message: "Please provide a valid email address" })
  @IsNotEmpty()
  email: string

  @ApiProperty({
    description: "User password",
    example: "SecurePass123!",
  })
  @IsString()
  @IsNotEmpty()
  password: string
}
