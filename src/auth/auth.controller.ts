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
import { AuthGuard } from './auth.guard';
import { SignInDto } from './dto/sign-in.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import ResponseObject from '../common/utils/response-object';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: SignInDto) {
    const [data, error] = await this.authService.SignIn(dto);
    if (!data) {
      return new ResponseObject(
        HttpStatus.UNAUTHORIZED,
        'Invalid email or password',
        null,
        error
      );
    }
    return new ResponseObject(HttpStatus.OK, 'Login success', data, null);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  getProfile({ req }: { req: any }) {
    return req.user;
  }

  @Get('login-with-google')
  loginWithGoogle() {
    return this.authService.loginWithGoogle();
  }
}
