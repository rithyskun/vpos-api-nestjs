import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { tokenType } from '../entities/token.entity';

export class CreateTokenDto {
  @IsString()
  token: string;

  @IsBoolean()
  expired: boolean;

  @IsBoolean()
  revoked: boolean;

  @IsString()
  @IsOptional()
  ipAddress?: string;

  @IsDate()
  createdAt?: Date;

  @IsNumber()
  userId: number;
}
