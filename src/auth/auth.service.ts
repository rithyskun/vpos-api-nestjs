import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';

// type JwtPayload = {
//   sub: string;
//   username: string;
// };

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, passwd: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.password === passwd) {
      return user;
    }
    throw new UnauthorizedException();
  }

  async signIn(email: string, password: string) {
    const user = await this.validateUser(email, password);

    const payload = { username: user.email, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
