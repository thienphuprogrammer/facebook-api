import { IJwt } from './jwt.interface';
import { ThrottlerOptions } from '@nestjs/throttler';
import { IEmailConfig } from './email-config.interface';
import { RedisOptions } from 'ioredis';

export interface IConfig {
  id: string;
  port: number;
  domain: string;
  redis: RedisOptions;
  jwt: IJwt;
  emailService: IEmailConfig;
  throttler: ThrottlerOptions;
  testing: boolean;
}
