import { Module } from '@nestjs/common';
import { Oauth2Service } from './oauth2.service';
import { Oauth2Controller } from './oauth2.controller';
import { UsersModule } from '@users';
import { JwtModule } from '../jwt/jwt.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config/dist';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    JwtModule,
    ConfigModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [Oauth2Controller],
  providers: [Oauth2Service, ConfigService],
})
export class Oauth2Module {}
