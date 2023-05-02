import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';
import { AuthService } from '../auth.service';

Injectable();
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {
    super({ email: 'email' });
  }

  async validate(req: Request) {
    const { email, password } = req.body;
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new BadRequestException('The email does not exists!');
    }

    const isValid = this.authService.validateUser(email, password);

    if (!isValid) throw new UnauthorizedException();

    return isValid;
  }
}
