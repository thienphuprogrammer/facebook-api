import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users';
import { CryptoModule } from '../crypto/crypto.module';
import { MailerModule } from '../mailer/mailer.module';
import { JwtModule } from '../jwt/jwt.module';
import { BlacklistedTokenEntity } from './entity/blacklisted-token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config/dist';
import { ThrottlerConfig } from '../config/throttler.config';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    CryptoModule.register(),
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([BlacklistedTokenEntity]),
    MailerModule,
    JwtModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useClass: ThrottlerConfig,
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
