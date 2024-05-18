import { config } from 'dotenv';

config();

export class Env {
  // Server database
  static readonly DB_HOST = process.env.DB_HOST || 'localhost';
  static readonly DB_PORT = parseInt(process.env.DB_PORT) || 3060;
  static readonly DB_USER = process.env.DB_USER || 'root';
  static readonly DB_PASSWORD = process.env.DB_PASSWORD || '';
  static readonly DB_NAME = process.env.DB_NAME || 'test';
  //HMAC
  static readonly HMAC_SECRET = process.env.HMAC_SECRET || 'secret';
  // JWT
  static readonly JWT_REFRESH_EXPIRES_IN =
    process.env.JWT_REFRESH_EXPIRES_IN || '1d';
  static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
  static readonly JWT_SECRET = process.env.JWT_SECRET || 'secret';
  static readonly JWT_ISSUER = process.env.JWT_ISSUER;
  static readonly JWT_EXPIRE = process.env.JWT_EXPIRE || '1h';
  static readonly JWT_ACCESS_TIME =
    parseInt(process.env.JWT_ACCESS_TIME, 10) || 60;
  static readonly JWT_CONFIRMATION_TIME =
    parseInt(process.env.JWT_CONFIRMATION_TIME, 10) || 60;
  static readonly JWT_RESET_PASSWORD_SECRET =
    process.env.JWT_RESET_PASSWORD_SECRET;
  static readonly JWT_RESET_PASSWORD_TIME =
    parseInt(process.env.JWT_RESET_PASSWORD_TIME, 10) || 60;
  static readonly JWT_REFRESH_SECRET =
    process.env.JWT_REFRESH_SECRET || 'secret';
  static readonly JWT_REFRESH_TIME =
    parseInt(process.env.JWT_REFRESH_TIME, 10) || 60;
  static readonly JWT_CONFIRMATION_SECRET =
    process.env.JWT_CONFIRMATION_SECRET || 'secret';
  // Keys directory
  static readonly KEYS_DIR_PATH = process.env.KEYS_DIR_PATH || 'keys';
  // refresh token
  static readonly REFRESH_COOKIE = process.env.REFRESH_COOKIE || 'refresh';
  static readonly COOKIE_SECRET = process.env.COOKIE_SECRET || 'secret';
  // Email
  static readonly EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
  static readonly EMAIL_PORT = parseInt(process.env.EMAIL_PORT) || 465;
  static readonly EMAIL_SECURE = process.env.EMAIL_SECURE === 'true';
  static readonly EMAIL_USER = process.env.EMAIL_USER;
  static readonly EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
  //General
  static readonly PORT = parseInt(process.env.PORT) || 3000;
  static readonly DOMAIN = process.env.DOMAIN || 'localhost:3000';
  static readonly NODE_ENV = process.env.NODE_ENV || 'development';
  static readonly APP_ID = process.env.APP_ID || 'app';

  //Redis
  static readonly REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

  //Throttler
  static readonly THROTTLE_TTL = parseInt(process.env.THROTTLE_TTL) || 60;
  static readonly THROTTLE_LIMIT = parseInt(process.env.THROTTLE_LIMIT) || 10;
}
