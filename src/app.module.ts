import { Module } from '@nestjs/common';
import { AuthGuard, AuthModule } from '@Auth';
import { UsersModule } from 'src/users';
import { DatabaseModule } from './db/database.module';
import { ConfigModule } from '@nestjs/config/dist';
import { validationSchema } from './config/config.schema';
import { config } from './config';
import { JwtModule } from './jwt/jwt.module';
import { CommonModule } from './common/common.module';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheConfig } from './config/cache.config';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    JwtModule,
    CommonModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      load: [config],
    }),
    CacheModule.registerAsync({
      useClass: CacheConfig,
      imports: [ConfigModule],
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [],
})
export class AppModule {}
