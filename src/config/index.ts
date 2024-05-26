import { IConfig } from './interfaces/config.interface';
import { readFileSync } from 'fs';
import { Env } from 'src/common/utils';
import { isUndefined } from '../common/utils/validation.util';

export function config(): IConfig {
  const publicKey = readFileSync(
    [__dirname, '..', '..', 'keys/public.pem'].join('/'),
    'utf8'
  );
  const privateKey = readFileSync(
    [__dirname, '..', '..', 'keys/private.pem'].join('/'),
    'utf8'
  );

  const testing = Env.NODE_ENV !== 'production';

  return {
    id: Env.APP_ID,
    port: Env.PORT,
    domain: Env.DOMAIN,
    jwt: {
      access: {
        privateKey,
        publicKey,
        time: Env.JWT_ACCESS_TIME,
      },
      confirmation: {
        secret: Env.JWT_CONFIRMATION_SECRET,
        time: Env.JWT_CONFIRMATION_TIME,
      },
      resetPassword: {
        secret: Env.JWT_RESET_PASSWORD_SECRET,
        time: Env.JWT_RESET_PASSWORD_TIME,
      },
      refresh: {
        secret: Env.JWT_REFRESH_SECRET,
        time: Env.JWT_REFRESH_TIME,
      },
    },
    emailService: {
      host: Env.EMAIL_HOST,
      port: Env.EMAIL_PORT,
      secure: Env.EMAIL_SECURE,
      auth: {
        user: Env.EMAIL_USER,
        pass: Env.EMAIL_PASSWORD,
      },
    },
    redis: Env.REDIS_URL,
    throttler: [
      {
        ttl: Env.THROTTLE_TTL,
        limit: Env.THROTTLE_LIMIT,
      },
    ],
    testing,
    url: Env.URL,
    oauth2: {
      microsoft:
        isUndefined(Env.MICROSOFT_CLIENT_ID) ||
        isUndefined(Env.MICROSOFT_CLIENT_SECRET)
          ? null
          : {
              id: Env.MICROSOFT_CLIENT_ID,
              secret: Env.MICROSOFT_CLIENT_SECRET,
            },
      google:
        isUndefined(Env.GOOGLE_CLIENT_ID) ||
        isUndefined(Env.GOOGLE_CLIENT_SECRET)
          ? null
          : {
              id: Env.GOOGLE_CLIENT_ID,
              secret: Env.GOOGLE_CLIENT_SECRET,
            },
      facebook:
        isUndefined(Env.FACEBOOK_CLIENT_ID) ||
        isUndefined(Env.FACEBOOK_CLIENT_SECRET)
          ? null
          : {
              id: Env.FACEBOOK_CLIENT_ID,
              secret: Env.FACEBOOK_CLIENT_SECRET,
            },
      github:
        isUndefined(Env.GITHUB_CLIENT_ID) ||
        isUndefined(Env.GITHUB_CLIENT_SECRET)
          ? null
          : {
              id: Env.GITHUB_CLIENT_ID,
              secret: Env.GITHUB_CLIENT_SECRET,
            },
    },
  };
}
