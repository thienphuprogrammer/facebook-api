import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity, UserDetails } from './entities';
import { AuthModule } from '@Auth';
import { CryptoModule } from '../crypto/crypto.module';

@Module({
  imports: [
    CryptoModule.register(),
    TypeOrmModule.forFeature([UsersEntity, UserDetails]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
