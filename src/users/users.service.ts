import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;
    const emailExist = await this.findByEmail(email);

    if (emailExist) {
      throw new ConflictException();
    }
    const salt = await bcrypt.genSalt(7);
    const hash = bcrypt.hashSync(createUserDto.password, salt);
    createUserDto.password = hash;
    return this.userRepository.save(createUserDto);
  }

  async findAll(query?: string): Promise<User[]> {
    const users = await this.userRepository.find();
    if (query) {
      return users.filter(
        (user) =>
          user.email.toLowerCase().includes(query.toLowerCase()) ||
          user.firstName.toLowerCase().includes(query.toLowerCase()),
      );
    }
    return users;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!user || user === null) {
      throw new NotFoundException();
    }
    return user;
  }

  async update(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(userId);

    if (!user) return;
    return await this.userRepository.save(Object.assign(user, updateUserDto));
  }

  async remove(userId: number): Promise<void> {
    const user = await this.findOne(userId);

    if (!user) return;
    await this.userRepository.delete({ id: userId });
  }
}
