import { IsEmail, IsOptional, IsString, ValidateIf } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export enum InviteMethod {
  EMAIL = "email",
  SMS = "sms",
  SOCIAL = "social",
}

export class CreateInviteDto {
  @ApiProperty({
    description: "Email of the person to invite",
    required: false,
    example: "friend@example.com",
  })
  @ValidateIf((o) => o.method === InviteMethod.EMAIL)
  @IsEmail()
  @IsOptional()
  email?: string

  @ApiProperty({
    description: "Phone number of the person to invite",
    required: false,
    example: "+15551234567",
  })
  @ValidateIf((o) => o.method === InviteMethod.SMS)
  @IsString()
  @IsOptional()
  phone?: string

  @ApiProperty({
    description: "Method to send the invitation",
    enum: InviteMethod,
    example: InviteMethod.EMAIL,
  })
  @IsString()
  method: InviteMethod
}

