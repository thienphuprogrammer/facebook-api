import { Inject, Injectable } from '@nestjs/common';
import { createSign, createVerify, createHmac } from 'node:crypto';
import { Env } from '../common/utils';

@Injectable()
export class CryptoService {
  constructor(
    @Inject('PRIVATE_KEY')
    private readonly privateKey: Buffer,
    @Inject('PUBLIC_KEY')
    private readonly publicKey: Buffer
  ) {}

  hmacSomething(something: string) {
    const hmac = createHmac('sha256', Env.HMAC_SECRET);
    hmac.update(something);
    return hmac.digest('base64');
  }

  signSomething(something: string) {
    const sign = createSign('RSA-SHA256');
    sign.update(something);
    return sign.sign(this.privateKey, 'base64');
  }

  verifySomething(something: string, signature: string) {
    const verify = createVerify('RSA-SHA256');
    verify.update(something);
    return verify.verify(this.publicKey, signature, 'base64');
  }
}
