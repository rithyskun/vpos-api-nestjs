import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { TokensService } from '../tokens/tokens.service';
import { CreateTokenDto } from '../tokens/dto/create-token.dto';

export interface UserDto {
  body: {
    email: string;
    password: string;
  };
  ip: string;
}
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private tokenService: TokensService,
  ) {}

  async validateUser(email: string, passwd: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    const validPassword = await bcrypt.compare(passwd, user.password);

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

  async signIn(userDto: UserDto) {
    const { email, password } = userDto.body;

    if (!email || !password)
      throw new BadRequestException('Invalid email and password');
    const user = await this.validateUser(email, password);

    const token = await this.generateToken(user.id, user.email);

    //TODO: save the token into DB
    // const data: CreateTokenDto = {
    //   token: token.refreshToken,
    //   expired: false,
    //   revoked: false,
    //   ipAddress: userDto.ip,
    //   createdAt: new Date(),
    //   userId: user.id,
    // };

    // await this.tokenService.save(data);

    return token;
  }

  async signup(userId: number, email: string) {
    const newToken = await this.generateToken(userId, email);
    return newToken;
  }

  async logout() {
    return null;
  }

  async refreshTokens(userId: number, refreshToken: string) {
    //Check if user exist
    const user = await this.usersService.findOne(userId);

    if (!user) throw new ForbiddenException();

    // Check if refresh token match
    // const decoded = this.jwtService.decode(refreshToken);

    const isValid = await this.verifyJwtToken(
      refreshToken,
      'JWT_REFRESH_SECRET',
    );

    console.log(isValid);

    return isValid;
  }

  async verifyJwtToken(
    token: string,
    keyName: 'JWT_ACCESS_SECRET' | 'JWT_REFRESH_SECRET',
  ) {
    const publicKey = Buffer.from(this.configService.get<string>(keyName));

    console.log(publicKey);
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
        expired: error.message || 'JWT Expired',
        decoded: null,
      };
    }
  }

  async generateToken(userId: number, email: string) {
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
}
