import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class SignInRequestDto {
  @ApiProperty({ example: 'rithy.skun@outlook.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123456789' })
  @IsNotEmpty()
  password: string;
}


export class SignUpRequestDto extends CreateUserDto { }


export class SignInResponseDto {
  @IsNotEmpty()
  @IsString()
  accessToken: string;

  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}

export class RegisterResponseDto {
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
    example: (Math.random() + 6).toString(36).substring(7) + '@email.com',
    description: 'Provide your email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    required: false,
  })
  @IsBoolean()
  status?: boolean;

  @ApiProperty({ default: 'admin' })
  @IsNotEmpty()
  roles!: string;
}

export class RegisterRegisterDto {
  @ApiProperty({
    example: (Math.random() + 6).toString(36).substring(7) + '@email.com',
    description: 'Provide your email address',
  })
  @IsEmail()
  @IsNotEmpty()
  destination: string;
}

export class MagicLinkRequestDto {
  @ApiProperty({
    example: 'baseUrl',
    description: 'Provide activation baseUrl link',
  })
  @IsNotEmpty()
  baseUrl: string;
}

export class SignUpResponseDto extends RegisterResponseDto {

}