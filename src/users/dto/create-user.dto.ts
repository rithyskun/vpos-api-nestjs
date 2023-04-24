import { IsString, IsNotEmpty, IsEmail, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'Rithy',
    description: 'Provide your first name',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'SKUN',
    description: 'Provide your last name',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    example: 'rithy.skun@outlook.com',
    description: 'Provide your email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Your secret password',
    description: 'Provide the secret password',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    required: false,
  })
  @IsBoolean()
  status?: boolean;

  @ApiProperty({ default: 'admin' })
  @IsNotEmpty()
  roles: string;
}
