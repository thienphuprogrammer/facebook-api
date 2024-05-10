import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountDetail, Accounts } from '@entities';
import { ValidationError } from 'class-validator';
import { CreateAccountDto } from './dto/create-account.dto';
import { AccountDetailDto } from './dto/account-detail.dto';

@Injectable()
export class AccountsService {
  constructor(
    // private readonly cryptoService: CryptoService,
    @InjectRepository(Accounts)
    private readonly accountsRepository: Repository<Accounts>,
    @InjectRepository(AccountDetail)
    private readonly accountDetailRepository: Repository<AccountDetail>
  ) {}

  async validateDetail(detail: AccountDetailDto, accountId?: string) {
    const errors: Array<ValidationError> = [];

    const result = await Promise.all([
      accountId
        ? this.accountsRepository.exists({ where: { id: accountId } })
        : Promise.resolve(false),
    ]);
  }

  async createAccount(dto: CreateAccountDto) {
    const errors: Array<ValidationError> = [];

    const result = await Promise.all([
      dto.detail ? this.validateDetail(dto.detail) : [],
    ]);
  }
}
