import { IsString, IsNotEmpty, IsEmail, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

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
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example:  (Math.random() + 6).toString(36).substring(7)+ '@email.com',
    description: 'Provide your email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Your secret password',
    description: 'Provide the secret password',
  })
  @IsNotEmpty()
  password!: string;

  @ApiProperty({
    required: false,
  })
  @IsBoolean()
  status?: boolean;

  @ApiProperty({ default: 'admin' })
  @IsNotEmpty()
  roles!: string;
}
