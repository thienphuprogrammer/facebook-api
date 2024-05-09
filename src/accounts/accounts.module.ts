import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountDetailEntity, Accounts } from '@entities';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService],
  imports: [TypeOrmModule.forFeature([Accounts, AccountDetailEntity])],
  exports: [AccountsService],
})
export class AccountsModule {}
