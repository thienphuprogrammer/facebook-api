import { Module } from '@nestjs/common';
import { Oauth2Service } from './oauth2.service';
import { Oauth2Controller } from './oauth2.controller';
import { UsersModule } from '@users';
import { JwtModule } from '../jwt/jwt.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    UsersModule,
    JwtModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [Oauth2Controller],
  providers: [Oauth2Service],
})
export class Oauth2Module {}
