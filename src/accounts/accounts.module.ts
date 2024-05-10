import { forwardRef, Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountDetail, Accounts } from '@entities';
import { CryptoModule } from '../crypto/crypto.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    CryptoModule.register(),
    TypeOrmModule.forFeature([Accounts, AccountDetail]),
    // forwardRef(() => AuthModule),
  ],
  controllers: [AccountsController],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}
