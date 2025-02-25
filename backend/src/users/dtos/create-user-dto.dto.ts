/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsArray, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true, message: 'Each score ID must be a number' })
  scores?: number[];  // Accepts an array of Score IDs (optional)
}
