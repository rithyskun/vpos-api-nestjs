import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as D from './dto'
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AppUtils } from 'src/utils/appUtils';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async create(body: D.CreateUserDto): Promise<any> {
    const { email } = body;
    const emailExist = await this.findByEmail(email);

    if (emailExist) {
      throw new ConflictException('EMAIL.ALREADY.EXIST');
    }
    const salt = await bcrypt.genSalt(7);
    const hash = bcrypt.hashSync(body.password, salt);
    body.password = hash;
    return await this.userRepository.save(body);
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
    return await this.userRepository.findOne({
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

    if (!user)
      return await this.userRepository.save(Object.assign({ user, ...updateUserDto }));
  }

  async remove(userId: number): Promise<void> {
    const user = await this.findOne(userId);

    if (!user) return;
    await this.userRepository.delete({ id: userId });
  }
}
