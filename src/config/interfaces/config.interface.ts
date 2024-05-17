import { IJwt } from './jwt.interface';
import { IEmailConfig } from '../../jwt/interfaces/email-config.interface';
import { DataSource } from 'typeorm';

export interface IConfig {
  id: string;
  port: number;
  domain: string;
  db: DataSource;
  jwt: IJwt;
  emailService: IEmailConfig;
}
