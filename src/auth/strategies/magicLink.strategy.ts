import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import MagicLoginStrategy from 'passport-magic-login';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MagicLinkStrategy extends PassportStrategy(
  MagicLoginStrategy,
  'magic-link',
) {
  private readonly logger = new Logger(MagicLinkStrategy.name);
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {
    super({
      secret: configService.get<string>('MAGIC_SECRET_CODE'),
      jwtOptions: {
        expiresIn: '15m',
      },
      callbackUrl: 'http://localhost:8000/api/v1/auth/register/callback',
      sendMagicLink: async (destination, href) => {
        //TODO: send email
        this.logger.debug(
          `Test send the magic link to ${destination} via ${href}`,
        );
      },
      verify: (payload, callback) => {
        // Get or create a user with the provided email from the database
        console.log(payload);
        callback(null, this.validate(payload));
      },
    });
  }

  validate(payload: { destination: string }) {
    console.log(payload);
    const user = this.authService.validateEmail(payload.destination);
    return user;
  }
}
