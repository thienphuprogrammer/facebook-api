import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccountsModule } from '@accounts';
import { CryptoModule } from '@crypto';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [CryptoModule.register(), forwardRef(() => AccountsModule)],
  exports: [AuthService],
})
export class AuthModule {}
