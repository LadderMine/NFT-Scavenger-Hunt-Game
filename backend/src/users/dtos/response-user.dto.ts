import { Type } from 'class-transformer';
import { IsInt, IsString, IsEmail, IsOptional, IsNotEmpty, IsDate } from 'class-validator';

export class UserResponseDto {
    @IsInt()
    id: number;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    password?: string;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    createdAt: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    updatedAt: Date;

}
