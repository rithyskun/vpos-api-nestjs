import {
  Controller,
  Post,
  Req,
  Get,
  UseGuards,
  Res,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiExcludeEndpoint,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { MagicLinkStrategy } from './strategies/magicLink.strategy';
import { SignupDto } from './dto/signup.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('login')
@Controller('/api/v1')
export class AuthController {
  constructor(
    private authService: AuthService,
    private strategy: MagicLinkStrategy,
  ) {}

  @ApiBody({ type: LoginDto })
  @ApiCreatedResponse()
  @ApiForbiddenResponse()
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse()
  @Post('auth/login')
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {
    const authToken = await this.authService.signIn(req);
    res.cookie('refreshToken', authToken.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict', // or 'Lax', it depends
      maxAge: 604800000, // 7 days
    });
    return res.send({ accessToken: authToken.accessToken });
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiExcludeEndpoint()
  @Get('auth/refresh')
  async refresh(@Req() req: Request) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];

    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Post('auth/signup')
  async signup(
    @Req() req,
    @Res() res,
    @Body(new ValidationPipe()) body: SignupDto, // As ValidationPipe was declare as global, we also can remove it here.
  ) {
    console.log(res.locals);
    await this.authService.validateEmail(body.destination);
    return this.strategy.send(req, res);
  }

  @UseGuards(AuthGuard('magic-link'))
  @Get('auth/signup/callback')
  async callback(@Req() req) {
    //TODO: generate the jwt token access
    return this.authService.signup(req.user.id, req.user.email);
  }
}
