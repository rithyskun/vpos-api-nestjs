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
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';

// @UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create User' })
  @ApiCreatedResponse({ type: User })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiConflictResponse()
  @ApiBadRequestResponse({ description: 'Bad request' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiQuery({
    name: 'query',
    required: false,
    description: 'Query with email or first name',
  })
  @ApiOkResponse({ type: User, isArray: true })
  @ApiUnauthorizedResponse()
  findAll(@Query('query') query: string) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({
    status: 200,
    description: 'The user found',
    type: User,
  })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: User })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
