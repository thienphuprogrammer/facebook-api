import { forwardRef, Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsEntity, AccountDetail } from './entities';
import { CryptoModule } from '@crypto';
import { AuthModule } from '@Auth';

@Module({
  imports: [
    CryptoModule.register(),
    TypeOrmModule.forFeature([AccountsEntity, AccountDetail]),
    forwardRef(() => AuthModule),
  ],
  controllers: [AccountsController],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}
