import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { TokensService } from '../tokens/tokens.service';
import { CreateTokenDto } from 'src/tokens/dto/create-token.dto';

import * as D from './dto';

export interface UserDto {
  email: string;
  password: string;
  ip: string;
}
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private tokenService: TokensService,
  ) { }

  async register(userId: number, email: string): Promise<any> {
    const newToken = await this.generateToken(userId, email);
    return newToken;
  }

  async signIn(body: D.SignInRequestDto): Promise<D.SignInResponseDto> {
    const { email, password } = body;

    if (!email || !password)
      throw new BadRequestException('Invalid email and password');
    const user = await this.validateUser(email, password);

    //TODO: save the token into DB
    // const data: CreateTokenDto = {
    //   token: token.refreshToken,
    //   expired: false,
    //   revoked: false,
    //   ipAddress: body.ip,
    //   createdAt: new Date(),
    //   userId: user.id,
    // };

    // await this.tokenService.save(data);
    return await this.generateToken(user.id, user.email);
  }

  async signup(body: D.SignUpRequestDto): Promise<D.RegisterResponseDto> {
    const data = await this.usersService.create(body);
    return {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      status: data.status,
      roles: data.roles
    }
  }

  async logout() {
    return 'Logout';
  }

  async reIssueAccessToken(refreshToken: string) {
    //Check if user exist
    const { decoded } = await this.verifyJwtToken(
      refreshToken,
      'JWT_REFRESH_SECRET',
    );

    if (!decoded) return null;

    const accessToken = await this.generateToken(decoded.sub, decoded.email);

    return accessToken;
  }

  async verifyJwtToken(
    token: string,
    keyName: 'JWT_ACCESS_SECRET' | 'JWT_REFRESH_SECRET',
  ) {
    const publicKey = Buffer.from(this.configService.get<string>(keyName));

    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: publicKey,
      });
      return {
        valid: true,
        expired: false,
        decoded,
      };
    } catch (error) {
      return {
        valid: false,
        expired: true,
        decoded: null,
      };
    }
  }

  async generateToken(userId: number, email: string): Promise<D.SignInResponseDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get<string>('JWT_AUTH_EXP'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REF_EXP'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
  async validateUser(email: string, passwd: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    const validPassword = await bcrypt.compare(passwd, user.password);

    if (!user) throw new BadRequestException('USER.DOES.NOT.EXIST')

    if (user && validPassword) {
      return user;
    }
    throw new UnauthorizedException();
  }

  async validateEmail(email: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
