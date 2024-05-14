import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AccountsEntity, AccountsService } from '@accounts';
import { SignInDto } from './dto/sign-in.dto';
import { TokenTypeEnum } from 'src/common/utils';
import { MailerService } from '../mailer/mailer.service';
import { JwtService } from '../jwt/jwt.service';
import { CommonService } from '../common/common.service';
import { BlacklistedTokenEntity } from './entity/blacklisted-token.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IAuthResult } from './interface/auth-result.interface';
import { IEmailToken, IRefreshToken } from '../jwt/interfaces';
import { isEmail } from 'class-validator';
import { compare } from 'bcrypt';
import { ICredentials } from '../accounts/interfaces';
import dayjs from 'dayjs';
import { IMessage } from '../config/interfaces/message.interface';
import { EmailDto } from './dto/email.dto';
import { isNull, isUndefined } from '../common/utils/validation.util';
import { ResetPasswordDto } from './dto/reset-password.dto';

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

  private comparePasswords(password1: string, password2: string): void {
    if (password1 !== password2) {
      throw new BadRequestException('Passwords do not match');
    }
  }

  public async SignIn(dto: SignInDto, domain?: string): Promise<IAuthResult> {
    const { email, password1 } = dto;
    const account = await this.accountByEmail(email);
    if (!account) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!(await compare(password1, account.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!account.confirmed) {
      const confirmationToken = await this.jwtService.generateToken(
        account,
        TokenTypeEnum.CONFIRMATION,
        domain
      );
      this.mailerService.sendConfirmationEmail(account, confirmationToken);
      throw new UnauthorizedException(
        'Please confirm your email address before signing in'
      );
    }
    const [accessToken, refreshToken] = await this.generateAuthTokens(
      account,
      domain
    );
    return {
      account,
      accessToken,
      refreshToken,
    };
  }

  private async accountByEmail(email: string): Promise<AccountsEntity> {
    if (!isEmail(email)) {
      throw new BadRequestException('Invalid email');
    }
    return this.accountsService.findOneByEmail(email);
  }

  private async checkLastPassword(
    credentials: ICredentials,
    password: string
  ): Promise<void> {
    const { lastPassword, passwordUpdatedAt } = credentials;

    if (lastPassword.length === 0 || !(await compare(password, lastPassword))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const now = dayjs();
    const time = dayjs.unix(passwordUpdatedAt);
    const months = now.diff(time, 'month');
    const message = 'You changed your password ';
    if (months > 0) {
      throw new UnauthorizedException(
        `${message} ${months} month${months > 1 ? 's' : ''} ago`
      );
    }
    const days = now.diff(time, 'day');
    if (days > 0) {
      throw new UnauthorizedException(
        `${message} ${days} day${days > 1 ? 's' : ''} ago`
      );
    }
    const hours = now.diff(time, 'hour');
    if (hours > 0) {
      throw new UnauthorizedException(
        `${message} ${hours} hour${hours > 1 ? 's' : ''} ago`
      );
    }
    const minutes = now.diff(time, 'minute');
    if (minutes > 0) {
      throw new UnauthorizedException(
        `${message} ${minutes} minute${minutes > 1 ? 's' : ''} ago`
      );
    }

    throw new UnauthorizedException(`${message} less than a minute ago`);
  }

  public async logout(refreshToken: string): Promise<IMessage> {
    const { id, tokenId } = await this.jwtService.verifyToken<IRefreshToken>(
      refreshToken,
      TokenTypeEnum.REFRESH
    );
    await this.blacklistToken(id, tokenId);
    return this.commonService.generateMessage('Logged out successfully');
  }

  private async blacklistToken(id: string, tokenId: string): Promise<void> {
    const blacklistedToken = this.blacklistedTokensRepository.create({
      user: { id },
      tokenId,
    });
    await this.blacklistedTokensRepository.save(blacklistedToken);
  }

  public async resetPasswordEmail(
    dto: EmailDto,
    domain?: string
  ): Promise<IMessage> {
    const account = await this.accountsService.uncheckedUserByEmail(dto.email);
    if (!isNull(account) && !isUndefined(account)) {
      const resetToken = await this.jwtService.generateToken(
        account,
        TokenTypeEnum.RESET_PASSWORD,
        domain
      );
      this.mailerService.sendResetPasswordEmail(account, resetToken);
    }
    return this.commonService.generateMessage(
      'If the email is registered, a reset password link will be sent'
    );
  }

  public async resetPassword(dto: ResetPasswordDto): Promise<IMessage> {
    const { password1, password2, resetToken } = dto;
    const { id, version } = await this.jwtService.verifyToken<IEmailToken>(
      resetToken,
      TokenTypeEnum.RESET_PASSWORD
    );
    this.comparePasswords(password1, password2);
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
    const [account] = await Promise.all([
      this.accountsService.findOneByCredentials(id, version),
    ]);
    const [accessToken, newRefreshToken] = await this.generateAuthTokens(
      account,
      domain,
      tokenId
    );
    return { account, accessToken, refreshToken: newRefreshToken };
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
