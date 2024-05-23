import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ThrottlerModuleOptions,
  ThrottlerOptionsFactory,
} from '@nestjs/throttler';
import { RedisOptions } from 'ioredis';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';

@Injectable()
export class ThrottlerConfig implements ThrottlerOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createThrottlerOptions(): ThrottlerModuleOptions {
    console.log('ThrottlerConfig -> createThrottlerOptions -> testing');
    console.log(this.configService.get<boolean>('testing'));
    console.log('ThrottlerConfig -> createThrottlerOptions -> throttler');
    console.log(this.configService.get<ThrottlerModuleOptions>('throttler'));
    return this.configService.get<boolean>('testing')
      ? this.configService.get<ThrottlerModuleOptions>('throttler')
      : {
          ...this.configService.get<ThrottlerModuleOptions>('throttler'),
          storage: new ThrottlerStorageRedisService(
            this.configService.get<RedisOptions>('redis')
          ),
        };
  }
}
