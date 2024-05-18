import { IJwt } from './jwt.interface';
import { IEmailConfig } from '../../jwt/interfaces';
import { RedisOptions } from 'ioredis';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';

export interface IConfig {
  id: string;
  port: number;
  domain: string;
  jwt: IJwt;
  emailService: IEmailConfig;
  redis: RedisOptions;
  throttler: ThrottlerModule;
}
