import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'rithy.skun@outlook.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456789' })
  password: string;
}
