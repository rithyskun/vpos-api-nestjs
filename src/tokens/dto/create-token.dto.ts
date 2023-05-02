import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

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
