import { IsBoolean, IsDate, IsEnum, IsNumber, IsString } from 'class-validator';
import { tokenType } from '../entities/token.entity';
import { User } from 'src/users/entities/user.entity';

export class CreateTokenDto {
  @IsString()
  token: string;

  @IsEnum(tokenType)
  type: tokenType;

  @IsBoolean()
  expired: boolean;

  @IsBoolean()
  revoked: boolean;

  @IsString()
  ipAddress?: string;

  @IsDate()
  createdAt: Date;

  @IsNumber()
  user: User;
}
