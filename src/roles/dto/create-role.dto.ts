import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @ApiProperty({ example: 'Admin' })
  @IsNotEmpty()
  roleName: string;
}
