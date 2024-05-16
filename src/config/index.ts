import { IConfig } from './interfaces/config.interface';
import { readFileSync } from 'fs';
import { Env } from 'src/common/utils';

export function config(): IConfig {
  const publicKey = readFileSync(
    [__dirname + '..', '..', 'keys/public.pem'].join('/'),
    'utf8'
  );
  const privateKey = readFileSync(
    [__dirname + '..', '..', 'keys/private.pem'].join('/'),
    'utf8'
  );

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
    db: undefined,
  };
}
