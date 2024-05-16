import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AccountsService, Accounts } from '@accounts';
import { CryptoService } from '@crypto';
import { JsonWebTokenError } from '@nestjs/jwt';
import { AuthLoginDto } from './dto/auth-login.dto';
import { Env } from 'src/common/utils';
import { AuthTokenReturnDto } from './dto/auth-token-return.dto';

@Injectable()
export class AuthService {
  constructor(
    private AccountsService: AccountsService,
    private CryptoService: CryptoService
  ) {}

  async logIn(dto: AuthLoginDto) {
    let account: Accounts = null;
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

  async loginWithGoogle() {
    // const client = this.CryptoService.createGoogleClient();
  }

  async verifyAccessToken(accessToken: string) {
    let account: Accounts = null;
    try {
      const accountId = this.CryptoService.verifyJwt(accessToken);
      account = await this.AccountsService.findById(accountId, {
        detail: true,
      });
    } catch (e) {
      if (!(e == JsonWebTokenError && e == HttpException)) {
        console.log(e);
      }
    }
    return account;
  }

  async generateAccessToken(account: Accounts) {
    const accountId = account.id.toString(); // convert id to string
    return Promise.all([
      this.CryptoService.signJwt(accountId),
      this.CryptoService.signJwt(accountId, Env.JWT_REFRESH_EXPIRES_IN),
    ]);
  }
}
