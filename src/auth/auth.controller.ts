import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard.js';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login(@Body() dto: LoginDto) {
    return this.authService.logIn();
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile({ req }: { req: any }) {
    return req.user;
  }

  @Get('login-with-google')
  loginWithGoogle() {
    return this.authService.loginWithGoogle();
  }
}
