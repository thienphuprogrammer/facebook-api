import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Not, Repository } from 'typeorm';
import { AccountDetail } from './entities/account.detail';
import { Accounts } from './entities/accounts';
import { ValidationError } from 'class-validator';
import { AccountDetailDto } from './dto/account-detail.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { MyValidationError } from '../errors/my-validation-error';
import { CryptoService } from '@crypto';
import { CommonService } from '../common/common.service';

@Injectable()
export class AccountsService {
  constructor(
    private readonly cryptoService: CryptoService,
    @InjectRepository(Accounts)
    private readonly accountsRepository: Repository<Accounts>,
    @InjectRepository(AccountDetail)
    private readonly accountDetailRepository: Repository<AccountDetail>,
    private readonly commonService: CommonService
  ) {}

  async validateDetail(
    detail: AccountDetailDto,
    accountId?: string
  ): Promise<ValidationError[]> {
    const errors: Array<ValidationError> = [];
    const result = await Promise.all([
      accountId
        ? this.accountsRepository.exists({
            where: {
              id: Not(accountId),
              detail: { number_phone: detail.number_phone },
            },
          })
        : this.accountsRepository.exists({
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
      this.accountsRepository.exists({ where: { email: email } }),
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
    accountId: string,
    relations?: FindOptionsRelations<Accounts>
  ) {
    const account = await this.accountsRepository.findOne({
      where: { id: accountId },
      relations: relations,
    });
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    return account;
  }

  async findByEmail(email: string) {
    const account = await this.accountsRepository.findOne({
      where: { email: email },
    });
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    return account;
  }

  async allAccounts() {
    return this.accountsRepository.find();
  }

  async create(dto: CreateAccountDto) {
    const errors: Array<ValidationError> = [];

    const formattedEmail = dto.email.toLowerCase();

    const results = await Promise.all([
      this.checkEmailUniqueness(formattedEmail),
      dto.detail ? this.validateDetail(dto.detail) : [],
    ]);

    if (results[0]) {
      errors.push({
        property: 'email',
        constraints: { isUnique: 'email already exists' },
      });
    }

    errors.push(...results[1]);

    if (errors.length > 0) {
      throw new MyValidationError(errors);
    }

    const accountDetail = dto.detail
      ? this.accountDetailRepository.create({ ...dto.detail })
      : undefined;

    const account = this.accountsRepository.save(
      this.accountsRepository.create({
        email: formattedEmail,
        password: this.cryptoService.signSomething(dto.password),
        detail: accountDetail,
      })
    );

    return account ? account : null;
  }

  public async findOneByEmail(email: string): Promise<Accounts | undefined> {
    const account = await this.accountsRepository.findOne({
      where: { email: email },
    });
    this.commonService.checkEntityExistence(account, 'Account');
    return account;
  }

  public async findOneById(id: string): Promise<Accounts | undefined> {
    const account = await this.accountsRepository.findOne({
      where: { id: id },
    });
    this.commonService.checkEntityExistence(account, 'Account');
    return account;
  }

  async fake100() {
    const accounts = [];
    for (let i = 0; i < 100; i++) {
      accounts.push(Accounts.fakeOne());
    }
    return this.accountsRepository.save(accounts);
  }
}
