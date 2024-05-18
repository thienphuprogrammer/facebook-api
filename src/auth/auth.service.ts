import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersEntity, UsersService } from 'src/users';
import { SignInDto } from './dto/sign-in.dto';
import { MailerService } from '../mailer/mailer.service';
import { JwtService } from '../jwt/jwt.service';
import { CommonService } from '../common/common.service';
import { IAuthResult } from './interface/auth-result.interface';
import { IEmailToken, IRefreshToken } from '../jwt/interfaces';
import { isEmail } from 'class-validator';
import { compare } from 'bcrypt';
import { ICredentials } from '../users/interfaces';
import dayjs from 'dayjs';
import { IMessage } from '../config/interfaces/message.interface';
import { EmailDto } from './dto/email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { isNull, isUndefined } from '../common/utils/validation.util';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { TokenTypeEnum } from '../jwt/enums/token-type.enum';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private usersService: UsersService,
    private readonly commonService: CommonService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService
  ) {}

  private comparePasswords(password1: string, password2: string): void {
    if (password1 !== password2) {
      throw new BadRequestException('Passwords do not match');
    }
  }

  public async signUp(dto: SignUpDto, domain?: string): Promise<IMessage> {
    const { email, password1, password2 } = dto;
    const user = await this.usersService.create(email, password1);
    const confirmationToken = await this.jwtService.generateToken(
      user,
      TokenTypeEnum.CONFIRMATION,
      domain
    );
    this.mailerService.sendConfirmationEmail(user, confirmationToken);
    return this.commonService.generateMessage('Registration successful');
  }

  public async SignIn(dto: SignInDto, domain?: string): Promise<IAuthResult> {
    const { email, password1 } = dto;
    const user = await this.userByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!(await compare(password1, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.confirmed) {
      const confirmationToken = await this.jwtService.generateToken(
        user,
        TokenTypeEnum.CONFIRMATION,
        domain
      );
      this.mailerService.sendConfirmationEmail(user, confirmationToken);
      throw new UnauthorizedException(
        'Please confirm your email address before signing in'
      );
    }
    const [accessToken, refreshToken] = await this.generateAuthTokens(
      user,
      domain
    );
    return {
      user: user,
      accessToken,
      refreshToken,
    };
  }

  private async userByEmail(email: string): Promise<UsersEntity> {
    if (!isEmail(email)) {
      throw new BadRequestException('Invalid email');
    }
    return this.usersService.findOneByEmail(email);
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
    const { id, tokenId, exp } =
      await this.jwtService.verifyToken<IRefreshToken>(
        refreshToken,
        TokenTypeEnum.REFRESH
      );
    await this.blacklistToken(id, tokenId, exp);
    return this.commonService.generateMessage('Logged out successfully');
  }

  private async blacklistToken(
    userId: number,
    tokenId: string,
    exp: number
  ): Promise<void> {
    const now = dayjs().unix();
    const ttl = (exp - now) * 1000;
    if (ttl > 0) {
      await this.commonService.throwInternalError(
        this.cacheManager.set(`blacklist:${userId}:${tokenId}`, now, ttl)
      );
    }
  }

  public async resetPasswordEmail(
    dto: EmailDto,
    domain?: string
  ): Promise<IMessage> {
    const user = await this.usersService.uncheckedUserByEmail(dto.email);
    if (!isNull(user) && !isUndefined(user)) {
      const resetToken = await this.jwtService.generateToken(
        user,
        TokenTypeEnum.RESET_PASSWORD,
        domain
      );
      this.mailerService.sendResetPasswordEmail(user, resetToken);
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
    await this.usersService.resetPassword(id, version, password1);
    return this.commonService.generateMessage('Password reset successfully');
  }

  public async changePassword(
    userId: number,
    dto: ChangePasswordDto
  ): Promise<IAuthResult> {
    const { password1, password2, password } = dto;
    this.comparePasswords(password1, password2);
    const user = await this.usersService.updatePassword(
      userId,
      password,
      password1
    );
    const [accessToken, refreshToken] = await this.generateAuthTokens(user);
    return { user, accessToken, refreshToken };
  }

  public async updatePassword(
    userId: number,
    dto: ChangePasswordDto,
    domain?: string
  ): Promise<IAuthResult> {
    const { password1, password2, password } = dto;
    this.comparePasswords(password1, password2);
    const user = await this.usersService.updatePassword(
      userId,
      password,
      password1
    );
    const [accessToken, refreshToken] = await this.generateAuthTokens(
      user,
      domain
    );
    return { user, accessToken, refreshToken };
  }

  async loginWithGoogle() {
    // const client = this.CryptoService.createGoogleClient();
  }

  private async generateAuthTokens(
    user: UsersEntity,
    domain?: string,
    tokenId?: string
  ): Promise<[string, string]> {
    return Promise.all([
      this.jwtService.generateToken(
        user,
        TokenTypeEnum.ACCESS,
        domain,
        tokenId
      ),
      this.jwtService.generateToken(
        user,
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
      this.usersService.findOneByCredentials(id, version),
    ]);
    const [accessToken, newRefreshToken] = await this.generateAuthTokens(
      user,
      domain,
      tokenId
    );
    return { user, accessToken, refreshToken: newRefreshToken };
  }

  private async checkIfTokenIsBlacklisted(
    userId: number,
    tokenId: string
  ): Promise<void> {
    const time = await this.cacheManager.get<number>(
      `blacklist:${userId}:${tokenId}`
    );
    if (!isUndefined(time) && !isNull(time)) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
