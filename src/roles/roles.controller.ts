import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Role } from './entities/role.entity';

@ApiTags('roles')
@Controller('roles')
@ApiBearerAuth()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiCreatedResponse({ type: Role })
  @ApiForbiddenResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  @ApiConflictResponse()
  @ApiBadRequestResponse()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @ApiQuery({
    name: 'query',
    required: false,
    description: 'query with roleName',
  })
  @ApiOkResponse({ isArray: true })
  @ApiForbiddenResponse()
  @ApiUnauthorizedResponse()
  findAll(@Query('query') query: string) {
    return this.rolesService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({ type: Role })
  @ApiForbiddenResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: Role })
  @ApiForbiddenResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Okay' })
  @ApiForbiddenResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.remove(id);
  }
}
