import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login(@Body() loginDto: Record<string, any>) {
    return this.authService.logIn();
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile({ req }: { req: any }) {
    return req.user;
  }
}
