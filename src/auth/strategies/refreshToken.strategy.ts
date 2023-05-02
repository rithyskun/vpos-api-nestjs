import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const data = req.cookies['refreshToken'];

          if (!data) return null;
          return data;
        },
      ]),
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    // const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    // return { ...payload, refreshToken };

    const refresh_token = req?.cookies['refreshToken'];

    if (!refresh_token) throw new UnauthorizedException();
    return { ...payload, refresh_token };
  }
}
