import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity, UserDetails } from './entities';
import { CryptoModule } from '@crypto';
import { AuthModule } from '@Auth';
import { UsersResolver } from './users.resolver';

@Module({
  imports: [
    CryptoModule.register(),
    TypeOrmModule.forFeature([UsersEntity, UserDetails]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
