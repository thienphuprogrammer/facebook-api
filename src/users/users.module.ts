import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity, AccountDetail } from './entities';
import { CryptoModule } from '@crypto';
import { AuthModule } from '@Auth';

@Module({
  imports: [
    CryptoModule.register(),
    TypeOrmModule.forFeature([UsersEntity, AccountDetail]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
