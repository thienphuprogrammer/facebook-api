import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AccountsService } from '@accounts';
import { CryptoService } from '@crypto';
import { JsonWebTokenError } from '@nestjs/jwt';
import { AccountsEntity } from '@entities';
import { LoginDto } from './dto/login.dto';
import { Env } from '@utils';
import { AuthTokenReturnDto } from './dto/auth-token-return.dto';

@Injectable()
export class AuthService {
  constructor(
    private AccountsService: AccountsService,
    private CryptoService: CryptoService
  ) {}

  async logIn(dto: LoginDto) {
    let account: AccountsEntity = null;
    try {
      account = await this.AccountsService.findByEmail(dto.email);
    } catch (e) {
      return [null, new UnauthorizedException('Invalid email or password')];
    }

    if (!account) {
      return [null, new UnauthorizedException('Invalid email or password')];
    }
    const isValid = this.CryptoService.verifySomething(
      dto.password,
      account.password
    );
    if (!isValid) {
      return [null, new UnauthorizedException('Invalid email or password')];
    }
    const [accessToken, refreshToken] = await this.generateAccessToken(account);
    return [
      new AuthTokenReturnDto(accessToken, account.role).setRefreshToken(
        refreshToken
      ),
      null,
    ];
  }

  async loginWithGoogle() {}

  async verifyAccessToken(accessToken: string) {
    let account: AccountsEntity = null;
    try {
      const accountId = this.CryptoService.verifyJwt(accessToken);
      account = await this.AccountsService.findById(accountId, {
        detail: true,
      });
    } catch (e) {
      if (!(e == JsonWebTokenError && e == HttpException)) {
        console.log(e);
        throw new HttpException('Invalid access token', 401);
      }
    }
    return account;
  }

  async generateAccessToken(account: AccountsEntity) {
    const mail = account.email;
    const accountId = account.id;
    return Promise.all([
      this.CryptoService.signJwt({ mail, accountId }),
      this.CryptoService.signJwt(
        { mail, accountId },
        Env.JWT_REFRESH_EXPIRES_IN
      ),
    ]);
  }
}
