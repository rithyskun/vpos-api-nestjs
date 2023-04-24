import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

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
      throw new HttpException(
        'The user email ' + email + ' already exists',
        HttpStatus.CONFLICT,
      );
    }
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

  async findByEmail(email: string): Promise<User> {
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
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async update(userId: number, updateUserDto: UpdateUserDto): Promise<any> {
    const user = await this.findOne(userId);

    if (!user) return;

    return await this.userRepository.update({ id: userId }, updateUserDto);
  }

  async remove(userId: number): Promise<void> {
    await this.userRepository.delete({ id: userId });
  }
}
