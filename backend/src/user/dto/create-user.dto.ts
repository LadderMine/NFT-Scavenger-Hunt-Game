import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(3, 30)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  })
  username: string;

  @IsEmail()
  email: string;
}
