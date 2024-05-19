import { DynamicModule, Module } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { generateKeyPairSync } from 'node:crypto';
import * as fs from 'fs';
import { Env } from '../common/utils';

@Module({
  providers: [CryptoService],
})
export class CryptoModule {
  static generateKeyPair(
    keysDir: string,
    privateKeyPath: string,
    publicKeyPath: string
  ) {
    if (!fs.existsSync(keysDir)) {
      fs.mkdirSync(keysDir);
    }

    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
    });
    fs.writeFileSync(
      privateKeyPath,
      privateKey.export({ format: 'pem', type: 'pkcs1' })
    );
    fs.writeFileSync(
      publicKeyPath,
      publicKey.export({ format: 'pem', type: 'pkcs1' })
    );
  }

  static register(): DynamicModule {
    const keysDir = Env.KEYS_DIR_PATH;
    const privateKeyPath = `${keysDir}/key`;
    const publicKeyPath = `${keysDir}/key.pub`;

    if (
      !(
        fs.existsSync(keysDir) &&
        fs.existsSync(privateKeyPath) &&
        fs.existsSync(publicKeyPath)
      )
    ) {
      this.generateKeyPair(keysDir, privateKeyPath, publicKeyPath);
    }

    const privateKey = fs.readFileSync(privateKeyPath);
    const publicKey = fs.readFileSync(publicKeyPath);

    return {
      module: CryptoModule,
      providers: [
        CryptoService,
        {
          provide: 'PRIVATE_KEY',
          useValue: privateKey,
        },
        {
          provide: 'PUBLIC_KEY',
          useValue: publicKey,
        },
      ],
      exports: [CryptoService],
    };
  }
}
