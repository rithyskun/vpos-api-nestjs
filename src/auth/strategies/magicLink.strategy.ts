import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import MagicLoginStrategy from 'passport-magic-login';
import { AuthService } from '../auth.service';

@Injectable()
export class MagicLinkStrategy extends PassportStrategy(
  MagicLoginStrategy,
  'magic-link',
) {
  private readonly logger = new Logger(MagicLinkStrategy.name);
  constructor(private authService: AuthService) {
    super({
      secret: 'your-secret',
      jwtOptions: {
        expiresIn: '5m',
      },
      callbackUrl: 'http://localhost:4000/api/v1/auth/signup/callback',
      sendMagicLink: async (destination, href) => {
        //TODO: send email
        this.logger.debug(
          `Test send the magic link to ${destination} via ${href}`,
        );
      },
      verify: (payload, callback) => {
        // Get or create a user with the provided email from the database
        callback(null, this.validate(payload));
      },
    });
  }

  validate(payload: { destination: string }) {
    const user = this.authService.validateEmail(payload.destination);
    return user;
  }
}
