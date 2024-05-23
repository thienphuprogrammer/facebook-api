import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '@users';
import { CryptoModule } from '@crypto';
import { MailerModule } from '../mailer/mailer.module';
import { JwtModule } from '../jwt/jwt.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config/dist';
import { ThrottlerConfig } from '../config/throttler.config';
import { AuthResolver } from './auth.resolver';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthResolver],
  imports: [
    CryptoModule.register(),
    forwardRef(() => UsersModule),
    MailerModule,
    JwtModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useClass: ThrottlerConfig,
    }),
  ],
})
export class AuthModule {}
