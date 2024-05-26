import { IJwt } from './jwt.interface';
import { ThrottlerOptions } from '@nestjs/throttler';
import { IEmailConfig } from './email-config.interface';
import { RedisOptions } from 'ioredis';
import { IOAuth2 } from './oauth2.interface';

export interface IConfig {
  readonly id: string;
  readonly url: string;
  readonly port: number;
  readonly domain: string;
  readonly redis: RedisOptions;
  readonly jwt: IJwt;
  readonly emailService: IEmailConfig;
  readonly throttler: ThrottlerOptions[];
  readonly testing: boolean;
  readonly oauth2: IOAuth2;
}
