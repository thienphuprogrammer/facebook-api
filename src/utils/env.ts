import { config } from 'dotenv';

config();

export class Env {
  static readonly PORT = process.env.PORT || 3000;
  static readonly DB_HOST = process.env.DB_HOST || 'localhost';
  static readonly DB_PORT = parseInt(process.env.DB_PORT) || 3060;
  static readonly DB_USER = process.env.DB_USER || 'root';
  static readonly DB_PASSWORD = process.env.DB_PASSWORD || '';
  static readonly DB_NAME = process.env.DB_NAME || 'test';
  static readonly JWT_SECRET = process.env.JWT_SECRET || 'secret';
  static readonly JWT_ISSUER = process.env.JWT_ISSUER;
  static readonly HMAC_SECRET = process.env.HMAC_SECRET || 'secret';
  static readonly KEYS_DIR_PATH = process.env.KEYS_DIR_PATH || 'keys';
  static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
  static readonly JWT_REFRESH_EXPIRES_IN =
    process.env.JWT_REFRESH_EXPIRES_IN || '1d';
}
