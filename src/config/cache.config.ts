import { Injectable } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-yet';
import { ConfigService } from '@nestjs/config/dist';
import { CacheModuleOptions } from '@nestjs/cache-manager';

@Injectable()
export class CacheConfig {
  constructor(private readonly configService: ConfigService) {}

  async createCacheOptions(): Promise<CacheModuleOptions> {
    return {
      store: await redisStore({
        ...this.configService.get('redis'),
        ttl: this.configService.get<number>('jwt.refresh.time'),
      }),
    };
  }
}
