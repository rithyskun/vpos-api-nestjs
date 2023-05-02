import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const isExistRole = await this.findByRoleName(createRoleDto.roleName);
    if (isExistRole) throw new ConflictException();
    return this.roleRepository.save(createRoleDto);
  }

  async findByRoleName(role: string): Promise<Role> {
    return this.roleRepository.findOneOrFail({
      where: {
        roleName: role,
      },
    });
  }

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  async findOne(id: number): Promise<Role> {
    return this.roleRepository.findOne({ where: { id: id } });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);

    if (!role) throw new NotFoundException();
    return await this.roleRepository.save(Object.assign(role, updateRoleDto));
  }

  async remove(id: number): Promise<void> {
    const role = await this.findOne(id);

    if (!role) throw new NotFoundException();
    this.roleRepository.delete({ id: id });
  }
}
