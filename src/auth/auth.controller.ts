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
import { Response } from 'express';
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
@Controller('auth')
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
  @Post('login')
  async login(@Req() req, @Res() res: Response) {
    const authToken = await this.authService.signIn(req);
    res.cookie('refreshToken', authToken.refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 604800000,
    });
    return res.send({ accessToken: authToken.accessToken });
    // return this.authService.signIn(req);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiExcludeEndpoint()
  @Get('refresh')
  async refresh(@Req() req, @Res() res: Response) {
    const refreshToken = req.cookies['refreshToken'];
    const newAccessToken = await this.authService.reIssueAccessToken(
      refreshToken,
    );

    res.cookie('refreshToken', newAccessToken.refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 604800000,
    });
    return res.status(200).send({
      accessToken: newAccessToken.accessToken,
    });
  }

  @Post('signup')
  async signup(
    @Req() req,
    @Res() res,
    @Body(new ValidationPipe()) body: SignupDto, // As ValidationPipe was declare as global, we also can remove it here.
  ) {
    await this.authService.validateEmail(body.destination);
    return this.strategy.send(req, res);
  }

  @UseGuards(AuthGuard('magic-link'))
  @Get('signup/callback')
  async callback(@Req() req) {
    //TODO: generate the jwt token access
    return this.authService.signup(req.user.id, req.user.email);
  }
}
