import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users';
import { CryptoModule } from '@crypto';
import { MailerModule } from '../mailer/mailer.module';
import { JwtModule } from '../jwt/jwt.module';
import { BlacklistedTokenEntity } from './entity/blacklisted-token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    CryptoModule.register(),
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([BlacklistedTokenEntity]),
    MailerModule,
    JwtModule,
  ],
  exports: [AuthService],
})
export class AuthModule {}
