import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsBoolean,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNumber()
  @IsOptional()
  id: number;
  @IsString()
  @ApiProperty({
    example: 'Rithy',
    description: 'Provide your first name',
  })
  firstName: string;

  @IsString()
  @ApiProperty({
    example: 'SKUN',
    description: 'Provide your last name',
  })
  lastName: string;

  @IsEmail()
  @ApiProperty({
    example: 'rithy.skun@outlook.com',
    description: 'Provide your email address',
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'Your secret password',
    description: 'Provide the secret password',
  })
  password: string;

  @IsBoolean()
  @ApiProperty({
    required: false,
  })
  status?: boolean;

  @ApiProperty()
  @IsString()
  roles: string;
}
