import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  roleName: string;
}
