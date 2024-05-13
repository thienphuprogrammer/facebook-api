import { Inject, Injectable } from '@nestjs/common';
import { createHmac, createSign, createVerify } from 'node:crypto';
import { Env } from '@utils';
import * as jwt from 'jsonwebtoken';
import { verify } from 'jsonwebtoken';

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
    const sign = createSign('SHA256');
    sign.update(something);
    return sign.sign(this.privateKey).toString('base64');
  }

  verifySomething(something: string, signature: string) {
    const verify = createVerify('SHA256');
    verify.update(something);
    return verify.verify(this.publicKey, Buffer.from(signature, 'base64'));
  }

  signJwt(subject: any, expiresIn: string = Env.JWT_EXPIRES_IN) {
    return jwt.sign({}, Env.JWT_SECRET, {
      subject: subject,
      issuer: Env.JWT_ISSUER,
      expiresIn: expiresIn,
    });
  }

  verifyJwt(token: string) {
    const subject = verify(token, Env.JWT_SECRET, {
      issuer: Env.JWT_ISSUER,
    }).sub;
    return typeof subject === 'string' ? subject : '';
  }
}
