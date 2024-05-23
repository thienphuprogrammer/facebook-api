import { ConfigService } from '@nestjs/config';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersEntity, UsersService } from '@users';
import { AuthService } from './auth.service';
import { AuthType } from './entity/gql/auth.type';
import { FastifyReply, FastifyRequest } from 'fastify';
import { isUndefined } from '../common/utils/validation.util';
import { UnauthorizedException } from '@nestjs/common';
import { Public } from './decorators/public.decorator';
import { MessageType } from '../common/entities/gql/message.type';
import { SignUpInput } from './inputs/sign-up.input';
import { Origin } from './decorators/origin.decorator';
import { IMessage } from '../common/interfaces/message.interface';
import { SignInInput } from './inputs/sign-in.input';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { EmailDto } from './dto/email.dto';
import { ResetPasswordInput } from './inputs/reset-password.input';
import { CurrentUser } from './decorators/current-user.decorator';
import { UpdatePasswordInput } from './inputs/update-password.input';

@Resolver(() => AuthType)
export class AuthResolver {
  private readonly cookiePath = '/api/graphql';
  private readonly cookieName: string;
  private readonly refreshTime: number;
  private readonly testing: boolean;

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService
  ) {
    this.cookieName = this.configService.get<string>('REFRESH_COOKIE');
    this.refreshTime = this.configService.get<number>('jwt.refresh.time');
    this.testing = this.configService.get<boolean>('testing');
  }

  private saveRefreshCookie(res: FastifyReply, refreshToken: string): void {
    res.cookie(this.cookieName, refreshToken, {
      secure: !this.testing,
      httpOnly: true,
      signed: true,
      path: this.cookiePath,
      expires: new Date(Date.now() + this.refreshTime * 1000),
    });
  }

  private refreshTokenFromReq(req: FastifyRequest): string {
    const token: string | undefined = req.cookies[this.cookieName];

    if (isUndefined(token)) {
      throw new UnauthorizedException();
    }

    return token;
  }

  @Public()
  @Mutation(() => MessageType)
  public async signUp(
    @Origin() origin: string | undefined,
    @Args('input') signUpInput: SignUpInput
  ): Promise<IMessage> {
    return await this.authService.signUp(signUpInput, origin);
  }

  @Public()
  @Mutation(() => AuthType)
  public async signIn(
    @Context('res') res: FastifyReply,
    @Origin() origin: string | undefined,
    @Args('input') signInInput: SignInInput
  ): Promise<AuthType> {
    const { refreshToken, ...authType } = await this.authService.signIn(
      signInInput,
      origin
    );
    this.saveRefreshCookie(res, refreshToken);
    return authType;
  }

  @Public()
  @Mutation(() => AuthType)
  public async refreshAccess(
    @Context('req') req: FastifyRequest,
    @Context('res') res: FastifyReply
  ): Promise<AuthType> {
    const token = this.refreshTokenFromReq(req);
    const { refreshToken, ...authType } =
      await this.authService.refreshTokenAccess(token, req.headers.origin);
    this.saveRefreshCookie(res, refreshToken);
    return authType;
  }

  @Mutation(() => MessageType)
  public async logout(
    @Context('req') req: FastifyRequest,
    @Context('res') res: FastifyReply
  ): Promise<IMessage> {
    const token = this.refreshTokenFromReq(req);
    res.clearCookie(this.cookieName);
    return this.authService.logout(token);
  }

  @Public()
  @Mutation(() => AuthType)
  public async confirmEmail(
    @Origin() origin: string | undefined,
    @Args() confirmEmailDto: ConfirmEmailDto,
    @Context('res') res: FastifyReply
  ) {
    const { refreshToken, ...authType } = await this.authService.confirmEmail(
      confirmEmailDto,
      origin
    );
    this.saveRefreshCookie(res, refreshToken);
    return authType;
  }

  @Public()
  @Mutation(() => MessageType)
  public async forgotPassword(
    @Origin() origin: string | undefined,
    @Args() emailDto: EmailDto
  ): Promise<IMessage> {
    return await this.authService.resetPasswordEmail(emailDto, origin);
  }

  @Public()
  @Mutation(() => MessageType)
  public async resetPassword(
    @Args('input') input: ResetPasswordInput
  ): Promise<IMessage> {
    return await this.authService.resetPassword(input);
  }

  @Mutation(() => AuthType)
  public async updatePassword(
    @CurrentUser() id: number,
    @Origin() origin: string | undefined,
    @Args('input') input: UpdatePasswordInput,
    @Context('res') res: FastifyReply
  ): Promise<AuthType> {
    const { refreshToken, ...authType } = await this.authService.updatePassword(
      id,
      input,
      origin
    );
    this.saveRefreshCookie(res, refreshToken);
    return authType;
  }

  @Query(() => UsersEntity)
  public async me(@CurrentUser() id: number): Promise<UsersEntity> {
    return await this.usersService.findOneById(id);
  }
}
