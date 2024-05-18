import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Not, Repository } from 'typeorm';
import { IUserDetails, IUsers } from './interfaces';
import { isInt, ValidationError } from 'class-validator';
import { UserDetailDto, CreateUserDto } from './dto';
import { MyValidationError } from '../errors/my-validation-error';
import { CommonService } from '../common/common.service';
import { UsersEntity, UserDetails } from './entities';
import { compare } from 'bcrypt';
import { CryptoService } from '../crypto/crypto.service';
import { isNull, isUndefined } from '../common/utils/validation.util';
import { PasswordDto } from './dto/password.dto';
import { SLUG_REGEX } from '../common/consts/regex.const';
import { ChangeEmailDto } from './dto/change-email.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly cryptoService: CryptoService,
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<IUsers>,
    @InjectRepository(UserDetails)
    private readonly userDetailRepository: Repository<IUserDetails>,
    private readonly commonService: CommonService
  ) {}

  async validateDetail(
    detail: UserDetailDto,
    userId?: number
  ): Promise<ValidationError[]> {
    const errors: Array<ValidationError> = [];
    const result = await Promise.all([
      userId
        ? this.usersRepository.exists({
            where: {
              id: Not(userId),
              detail: { number_phone: detail.number_phone },
            },
          })
        : this.usersRepository.exists({
            where: { detail: { number_phone: detail.number_phone } },
          }),
    ]);

    if (result[0]) {
      const error = new ValidationError();
      error.property = 'number_phone';
      error.constraints = { isUnique: 'number_phone already exists' };
      errors.push(error);
    }
    return errors;
  }

  public async checkEmailUniqueness(email: string): Promise<ValidationError[]> {
    const errors: Array<ValidationError> = [];
    const result = await Promise.all([
      this.usersRepository.exists({ where: { email: email } }),
    ]);
    if (result[0]) {
      const error = new ValidationError();
      error.property = 'email';
      error.constraints = { isUnique: 'email already exists' };
      errors.push(error);
    }
    return errors;
  }

  async findById(
    userId: number,
    relations?: FindOptionsRelations<UsersEntity>
  ) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: relations,
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email: email },
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  async allUsers() {
    return this.usersRepository.find();
  }

  async create(email: string, password: string): Promise<UsersEntity> {
    const formattedEmail = email.toLowerCase();
    await this.checkEmailUniqueness(formattedEmail);
    const user = this.usersRepository.create({
      email: formattedEmail,
      password: this.cryptoService.signSomething(password),
    });
    await this.commonService.saveEntity(this.usersRepository, user, true);
    return user;
  }

  public async findOneByEmail(email: string): Promise<IUsers> {
    const user = await this.usersRepository.findOne({
      where: { email: email },
    });
    this.commonService.checkEntityExistence(user, 'users');
    return user;
  }

  public async findOneById(id: number): Promise<IUsers> {
    const user = await this.usersRepository.findOne({
      where: { id: id },
    });
    this.commonService.checkEntityExistence(user, 'users');
    return user;
  }

  public async uncheckedUserByEmail(email: string): Promise<IUsers> {
    const formattedEmail = email.toLowerCase();
    return this.usersRepository.findOne({
      where: { email: formattedEmail },
    });
  }

  public async throwUnauthorizedException(
    user: IUsers | undefined | null
  ): Promise<void> {
    if (isUndefined(user) || isNull(user)) {
      throw new UnauthorizedException('user not found');
    }
  }

  public async findOneByCredentials(
    id: number,
    version: number
  ): Promise<IUsers> {
    const user = await this.usersRepository.findOne({
      where: { id: id },
    });
    await this.throwUnauthorizedException(user);
    if (user.credentials.version !== version) {
      throw new UnauthorizedException('Invalid version');
    }
    return user;
  }

  public async updatePassword(
    userId: number,
    password: string,
    newPassword: string
  ): Promise<IUsers> {
    const user = await this.findOneById(userId);
    if (!(await compare(password, user.password))) {
      throw new BadRequestException('Wrong password');
    }
    if (await compare(newPassword, user.password)) {
      throw new BadRequestException('New password must be different');
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
  ): Promise<IUsers> {
    const user = await this.findOneByCredentials(userId, version);
    user.credentials.updatePassword(user.password);
    user.password = this.cryptoService.signSomething(password);
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

    // return this.findOneByUsername(idOrUsername);
  }

  public async updateEmail(
    userId: number,
    dto: ChangeEmailDto
  ): Promise<UsersEntity> {
    const user = await this.findOneById(userId);
    const { email, password } = dto;

    if (!(await compare(password, user.password))) {
      throw new BadRequestException('Invalid password');
    }

    const formattedEmail = email.toLowerCase();
    await this.checkEmailUniqueness(formattedEmail);
    user.credentials.updateVersion();
    user.email = formattedEmail;
    await this.commonService.saveEntity(this.usersRepository, user);
    return user;
  }

  async fake100() {
    const users = [];
    for (let i = 0; i < 100; i++) {
      users.push(UsersEntity.fakeOne());
    }
    return this.usersRepository.save(users);
  }
}
