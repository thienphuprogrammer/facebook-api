import { IJwt } from './jwt.interface';
import { IEmailConfig } from '../../jwt/interfaces/email-config.interface';

export interface IConfig {
  id: string;
  port: number;
  domain: string;
  db: string;
  jwt: IJwt;
  emailService: IEmailConfig;
}
