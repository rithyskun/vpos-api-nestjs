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
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiExcludeEndpoint,
  ApiForbiddenResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import * as D from './dto'
import { MagicLinkStrategy } from './strategies/magicLink.strategy';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('login')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private strategy: MagicLinkStrategy,
  ) { }

  @ApiBody({ type: D.SignInRequestDto })
  @ApiCreatedResponse()
  @ApiForbiddenResponse()
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @Post('login')
  async login(@Body() body: D.SignInRequestDto): Promise<D.SignInResponseDto> {
    return await this.authService.signIn(body);
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
  async signup(@Body() body: D.SignUpRequestDto): Promise<D.RegisterResponseDto> {
    return await this.authService.signup(body);
  }

  @Post('register')
  @ApiBody({ type: D.RegisterRegisterDto })
  @ApiCreatedResponse()
  @ApiForbiddenResponse()
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiConflictResponse()
  async register(@Req() req: Request,
    @Res() res: Response,
    @Body(new ValidationPipe()) body: D.RegisterRegisterDto): Promise<void> {

    // const { destination } = body;
    // await this.authService.validateEmail(destination);
    return this.strategy.send(req, res);
  }

  @UseGuards(AuthGuard('magic-link'))
  @ApiBody({ type: D.MagicLinkRequestDto })
  @Get('register/callback')
  async callback(@Req() req): Promise<void> {
    //TODO: generate the jwt token access
    console.log(req.user.id)
    return await this.authService.register(req.user.id, req.user.email);
  }
}
