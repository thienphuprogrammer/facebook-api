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
import { AuthGuard } from './guards/auth.guard';
import { SignInDto } from './dto/sign-in.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import ResponseObject from '../common/utils/response-object';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  getProfile({ req }: { req: any }) {
    return req.user;
  }
}
