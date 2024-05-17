import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AccountsEntity, AccountsService } from '@accounts';
import { JsonWebTokenError } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { Env, TokenTypeEnum } from 'src/common/utils';
import { AuthTokenReturnDto } from './dto/auth-token-return.dto';
import { MailerService } from '../mailer/mailer.service';
import { JwtService } from '../jwt/jwt.service';
import { CommonService } from '../common/common.service';
import { BlacklistedTokenEntity } from './entity/blacklisted-token.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IAuthResult } from './interface/auth-result.interface';
import { IRefreshToken } from '../jwt/interfaces';

@Injectable()
export class AuthService {
  constructor(
    private accountsService: AccountsService,
    private readonly commonService: CommonService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    @InjectRepository(BlacklistedTokenEntity)
    private readonly blacklistedTokensRepository: Repository<BlacklistedTokenEntity>
  ) {}

  async logIn(
    dto: SignInDto,
    domain?: string
  ): Promise<[AuthTokenReturnDto, HttpException]> {
    let account: AccountsEntity = null;
    try {
      account = await this.accountsService.findByEmail(dto.email);
    } catch (e) {
      return [null, new UnauthorizedException('Invalid email or password')];
    }

    if (!account) {
      return [null, new UnauthorizedException('Invalid email or password')];
    }
    const isValid = null;
    if (!isValid) {
      return [null, new UnauthorizedException('Invalid email or password')];
    }
    const [accessToken, refreshToken] = await this.generateAuthTokens(account);
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

  private async generateAuthTokens(
    account: AccountsEntity,
    domain?: string,
    tokenId?: string
  ): Promise<[string, string]> {
    return Promise.all([
      this.jwtService.generateToken(
        account,
        TokenTypeEnum.ACCESS,
        domain,
        tokenId
      ),
      this.jwtService.generateToken(
        account,
        TokenTypeEnum.REFRESH,
        domain,
        tokenId
      ),
    ]);
  }

  public async refreshTokenAccess(
    refreshToken: string,
    domain?: string
  ): Promise<IAuthResult> {
    const { id, version, tokenId } =
      await this.jwtService.verifyToken<IRefreshToken>(
        refreshToken,
        TokenTypeEnum.REFRESH
      );

    await this.checkIfTokenIsBlacklisted(id, tokenId);
    const [user] = await Promise.all([
      this.accountsService.findOneByCredentials(id, version),
    ]);
    const [accessToken, newRefreshToken] = await this.generateAuthTokens(
      user,
      domain,
      tokenId
    );
    return { user, accessToken, refreshToken: newRefreshToken };
  }

  private async checkIfTokenIsBlacklisted(
    accountId: string,
    tokenId: string
  ): Promise<void> {
    const count = await this.blacklistedTokensRepository.count({
      where: { tokenId, user: { id: accountId } },
    });

    if (count > 0) {
      throw new UnauthorizedException('Token is invalid');
    }
  }
}
