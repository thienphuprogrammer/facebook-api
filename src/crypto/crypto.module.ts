import { Module } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { generateKeyPairSync } from 'node:crypto';
import * as fs from 'fs';

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
}
