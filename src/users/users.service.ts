import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { isInt } from 'class-validator';
import { CommonService } from '../common/common.service';
import { CredentialsEmbeddable, UsersEntity } from './entities';
import { isNull, isUndefined } from '../common/utils/validation.util';
import { compare } from 'bcrypt';
import { CryptoService } from '@crypto';
import { SLUG_REGEX } from '../common/consts/regex.const';
import { PasswordDto } from './dto/password.dto';
import { ChangeEmailDto } from './dto/change-email.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OAuthProviderEntity } from './entities/oauth-provider.entity';
import { OAuthProvidersEnum } from './enums/oauth-providers.enum';

@Injectable()
export class UsersService {
  constructor(
    private readonly cryptoService: CryptoService,
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    // @InjectRepository(AccountDetail)
    // private readonly accountDetailRepository: Repository<IUserDetails>,
    @InjectRepository(OAuthProviderEntity)
    private readonly oauthProvidersRepository: Repository<OAuthProviderEntity>,
    private readonly commonService: CommonService
  ) {}

  // async validateDetail(
  //   detail: UserDetailsDto,
  //   userId?: number
  // ): Promise<ValidationError[]> {
  //   const errors: Array<ValidationError> = [];
  //   const result = await Promise.all([
  //     userId
  //       ? this.usersRepository.exists({
  //           where: {
  //             id: Not(Number(userId)),
  //             detail: { number_phone: detail.number_phone },
  //           },
  //         })
  //       : this.usersRepository.exists({
  //           where: { detail: { number_phone: detail.number_phone } },
  //         }),
  //   ]);
  //
  //   if (result[0]) {
  //     const error = new ValidationError();
  //     error.property = 'number_phone';
  //     error.constraints = { isUnique: 'number_phone already exists' };
  //     errors.push(error);
  //   }
  //   return errors;
  // }

  public async create(
    provider: OAuthProvidersEnum,
    email: string,
    name: string,
    password?: string
  ): Promise<UsersEntity> {
    const isConfirmed = provider !== OAuthProvidersEnum.LOCAL;
    const formattedEmail = email.toLowerCase();
    await this.checkEmailUniqueness(formattedEmail);
    const formattedName = this.commonService.formatName(name);
    const user = this.usersRepository.create({
      email: formattedEmail,
      name: formattedName,
      username: await this.generateUsername(formattedName),
      password: this.cryptoService.signSomething(password),
      confirmed: isConfirmed,
      credentials: new CredentialsEmbeddable(isConfirmed),
    });
    await this.commonService.saveEntity(this.usersRepository, user, true);
    await this.createOAuthProvider(provider, user.id);
    return user;
  }

  public async findOneByIdOrUsername(
    idOrUsername: string
  ): Promise<UsersEntity> {
    const parsedValue = parseInt(idOrUsername, 10);

    if (!isNaN(parsedValue) && parsedValue > 0 && isInt(parsedValue)) {
      return this.findOneById(parsedValue);
    }

    if (
      idOrUsername.length < 3 ||
      idOrUsername.length > 106 ||
      !SLUG_REGEX.test(idOrUsername)
    ) {
      throw new BadRequestException('Invalid username');
    }

    return this.findOneByUsername(idOrUsername);
  }

  public async findOneById(id: number): Promise<UsersEntity> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    this.commonService.checkEntityExistence(user, 'User');
    return user;
  }

  public async findOneByUsername(
    username: string,
    forAuth = false
  ): Promise<UsersEntity> {
    const user = await this.usersRepository.findOne({
      where: { username: username.toLowerCase() },
    });

    if (forAuth) {
      this.throwUnauthorizedException(user);
    } else {
      this.commonService.checkEntityExistence(user, 'User');
    }

    return user;
  }

  public async findOneByEmail(email: string): Promise<UsersEntity> {
    const user = await this.usersRepository.findOne({
      where: { email: email.toLowerCase() },
    });
    this.throwUnauthorizedException(user);
    return user;
  }

  // necessary for password reset
  public async uncheckedUserByEmail(email: string): Promise<UsersEntity> {
    const formattedEmail = email.toLowerCase();
    return this.usersRepository.findOne({
      where: { email: formattedEmail },
    });
  }

  public async findOneByCredentials(
    id: number,
    version: number
  ): Promise<UsersEntity> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['credentials'],
    });
    this.throwUnauthorizedException(user);

    if (user.credentials.version !== version) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  public async confirmEmail(
    userId: number,
    version: number
  ): Promise<UsersEntity> {
    const user = await this.findOneByCredentials(userId, version);

    if (user.confirmed) {
      throw new BadRequestException('Email already confirmed');
    }

    user.confirmed = true;
    user.credentials.updateVersion();
    await this.commonService.saveEntity(this.usersRepository, user);
    return user;
  }

  public async update(
    userId: number,
    dto: UpdateUserDto
  ): Promise<UsersEntity> {
    const user = await this.findOneById(userId);
    const { name, username } = dto;

    if (!isUndefined(name) && !isNull(name)) {
      if (name === user.name) {
        throw new BadRequestException('Name must be different');
      }

      user.name = this.commonService.formatName(name);
    }
    if (!isUndefined(username) && !isNull(username)) {
      const formattedUsername = dto.username.toLowerCase();

      if (user.username === formattedUsername) {
        throw new BadRequestException('Username should be different');
      }

      await this.checkUsernameUniqueness(formattedUsername);
      user.username = formattedUsername;
    }

    await this.commonService.saveEntity(this.usersRepository, user);
    return user;
  }

  public async updatePassword(
    userId: number,
    newPassword: string,
    password?: string
  ): Promise<UsersEntity> {
    const user = await this.findOneById(userId);

    if (user.password === 'UNSET') {
      await this.createOAuthProvider(OAuthProvidersEnum.LOCAL, user.id);
    } else {
      if (isUndefined(password) || isNull(password)) {
        throw new BadRequestException('Password is required');
      }
      if (!(await compare(password, user.password))) {
        throw new BadRequestException('Wrong password');
      }
      if (await compare(newPassword, user.password)) {
        throw new BadRequestException('New password must be different');
      }
    }

    user.credentials.updatePassword(user.password);
    user.password = this.cryptoService.signSomething(newPassword);
    await this.commonService.saveEntity(this.usersRepository, user);
    return user;
  }

  public async resetPassword(
    userId: number,
    version: number,
    password: string
  ): Promise<UsersEntity> {
    const user = await this.findOneByCredentials(userId, version);
    user.credentials.updatePassword(user.password);
    user.password = this.cryptoService.signSomething(password);
    await this.commonService.saveEntity(this.usersRepository, user);
    return user;
  }

  public async updateName(userId: number, name: string): Promise<UsersEntity> {
    const user = await this.findOneById(userId);
    const formattedName = this.commonService.formatName(name);

    if (user.name === formattedName) {
      throw new BadRequestException('Name must be different');
    }

    user.name = formattedName;
    await this.commonService.saveEntity(this.usersRepository, user);
    return user;
  }

  public async updateUsername(
    userId: number,
    username: string
  ): Promise<UsersEntity> {
    const user = await this.findOneById(userId);
    const formattedUsername = username.toLowerCase();

    if (user.username === formattedUsername) {
      throw new BadRequestException('Username should be different');
    }

    await this.checkUsernameUniqueness(formattedUsername);
    user.username = formattedUsername;
    await this.commonService.saveEntity(this.usersRepository, user);
    return user;
  }

  public async updateEmail(
    userId: number,
    dto: ChangeEmailDto
  ): Promise<UsersEntity> {
    const user = await this.findOneById(userId);
    const { email, password } = dto;

    if (!(await compare(password, user.password))) {
      throw new BadRequestException('Wrong password');
    }

    const formattedEmail = email.toLowerCase();

    if (user.email === formattedEmail) {
      throw new BadRequestException('Email should be different');
    }

    await this.checkEmailUniqueness(formattedEmail);
    user.email = formattedEmail;
    await this.commonService.saveEntity(this.usersRepository, user);
    return user;
  }

  public async delete(userId: number, dto: PasswordDto): Promise<UsersEntity> {
    const user = await this.findOneById(userId);

    if (!(await compare(dto.password, user.password))) {
      throw new BadRequestException('Wrong password');
    }

    await this.commonService.removeEntity(this.usersRepository, user);
    return user;
  }

  private async checkUsernameUniqueness(username: string): Promise<void> {
    const count = await this.usersRepository.count({
      where: { username },
    });

    if (count > 0) {
      throw new ConflictException('Username already in use');
    }
  }

  private throwUnauthorizedException(
    user: undefined | null | UsersEntity
  ): void {
    if (isUndefined(user) || isNull(user)) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  private async checkEmailUniqueness(email: string): Promise<void> {
    const count = await this.usersRepository.count({
      where: { email },
    });

    if (count > 0) {
      throw new ConflictException('Email already in use');
    }
  }

  private async generateUsername(name: string): Promise<string> {
    const pointSlug = this.commonService.generatePointSlug(name);
    const count = await this.usersRepository.count({
      where: { username: pointSlug },
    });

    if (count > 0) {
      return `${pointSlug}${count}`;
    }

    return pointSlug;
  }
  private async createOAuthProvider(
    provider: OAuthProvidersEnum,
    userId: number
  ): Promise<OAuthProviderEntity> {
    const oauthProvider = this.oauthProvidersRepository.create({
      provider,
      user: { id: userId },
    });

    await this.commonService.saveEntity(
      this.oauthProvidersRepository,
      oauthProvider,
      true
    );
    return oauthProvider;
  }

  public async findOrCreate(
    provider: OAuthProvidersEnum,
    email: string,
    name: string
  ): Promise<UsersEntity> {
    const formattedEmail = email.toLowerCase();
    const user = await this.usersRepository.findOne({
      where: { email: formattedEmail },
    });

    if (isUndefined(user) || isNull(user)) {
      return this.create(provider, email, name);
    }
    if (
      isUndefined(
        user.oauthProviders.find(
          (p) => p.provider === provider && p.user.id === user.id
        )
      )
    ) {
      await this.createOAuthProvider(provider, user.id);
    }

    return user;
  }

  private async changePassword(
    user: UsersEntity,
    password: string
  ): Promise<UsersEntity> {
    user.credentials.updatePassword(user.password);
    user.password = this.cryptoService.signSomething(password);
    await this.commonService.saveEntity(this.usersRepository, user);
    return user;
  }

  public async findOAuthProviders(
    userId: number
  ): Promise<OAuthProviderEntity[]> {
    // select * from oauth_provider where user_id = userId order by QueryOrder desc
    return await this.oauthProvidersRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async fake100() {
    const accounts = [];
    for (let i = 0; i < 100; i++) {
      accounts.push(UsersEntity.fakeOne());
    }
    return this.usersRepository.save(accounts);
  }
}
