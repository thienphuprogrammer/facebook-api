import { Module } from '@nestjs/common';
import { AuthGuard, AuthModule } from '@Auth';
import { UsersModule } from '@users';
import { DatabaseModule } from './db/database.module';
import { ConfigModule } from '@nestjs/config/dist';
import { validationSchema } from './config/config.schema';
import { config } from './config';
import { JwtModule } from './jwt/jwt.module';
import { CommonModule } from './common/common.module';
import { MailerModule } from './mailer/mailer.module';
import { CryptoModule } from '@crypto';
import { CacheConfig } from './config/cache.config';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLConfig } from './config/graph-ql.config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule } from '@nestjs/common/cache';
import { Oauth2Module } from './oauth2/oauth2.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      load: [config],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [ConfigModule],
      driver: ApolloDriver,
      useClass: GraphQLConfig,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useClass: CacheConfig,
    }),

    AuthModule,
    UsersModule,
    DatabaseModule,
    JwtModule,
    CommonModule,
    MailerModule,
    CryptoModule,
    Oauth2Module,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
