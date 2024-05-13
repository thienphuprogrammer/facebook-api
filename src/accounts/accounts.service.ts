import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Not, Repository } from 'typeorm';
import { AccountDetailEntity, AccountsEntity } from '@entities';
import { ValidationError } from 'class-validator';
import { AccountDetailDto } from './dto/account-detail.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { MyValidationError } from '../errors/my-validation-error';
import { CryptoService } from '@crypto';

@Injectable()
export class AccountsService {
  constructor(
    private readonly cryptoService: CryptoService,
    @InjectRepository(AccountsEntity)
    private readonly accountsRepository: Repository<AccountsEntity>,
    @InjectRepository(AccountDetailEntity)
    private readonly accountDetailRepository: Repository<AccountDetailEntity>
  ) {}

  async validateDetail(detail: AccountDetailDto, accountId?: string) {
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

  async findById(
    accountId: string,
    relations?: FindOptionsRelations<AccountsEntity>
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

    const results = await Promise.all([
      this.accountsRepository.exists({ where: { email: dto.email } }),
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
        email: dto.email,
        password: this.cryptoService.signSomething(dto.password),
        detail: accountDetail,
      })
    );

    return account ? account : null;
  }

  async fake100() {
    const accounts = [];
    for (let i = 0; i < 100; i++) {
      accounts.push(AccountsEntity.fakeOne());
    }
    return this.accountsRepository.save(accounts);
  }
}
