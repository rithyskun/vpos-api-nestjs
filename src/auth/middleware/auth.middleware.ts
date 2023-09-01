import {
  ForbiddenException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) { }
  async use(req: Request, res: Response, next: NextFunction) {
    const accessToken = this.extractTokenFromHeader(req);
    const refreshToken = req.cookies['refreshToken'];

    if (!accessToken) {
      throw new ForbiddenException();
    }

    const { decoded, expired } = await this.authService.verifyJwtToken(
      accessToken,
      'JWT_ACCESS_SECRET',
    );

    if (decoded) {
      res.locals.user = decoded;

      return next();
    }

    if (expired && refreshToken) {
      const token = await this.authService.reIssueAccessToken(refreshToken);

      if (!token) {
        res.locals.user = null;
        throw new UnauthorizedException('Token expired');
      }

      const newToken = await this.authService.verifyJwtToken(
        token.accessToken,
        'JWT_ACCESS_SECRET',
      );

      if (newToken) {
        res.locals.user = newToken.decoded;
        return next();
      }
    }

    return next();
  }

  private extractTokenFromHeader(req: Request): string | undefined {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
