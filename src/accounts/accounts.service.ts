import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Repository } from 'typeorm';
import { AccountDetail, Accounts } from '@entities';
import { ValidationError } from 'class-validator';
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

  async findById(
    accountId: string,
    relations?: FindOptionsRelations<Accounts>
  ) {
    const account = await this.accountsRepository.findOne({
      where: { id: accountId },
      relations: relations,
    });
    if (!account) {
      throw new Error('Account not found');
    }
    return account;
  }

  async findByEmail(email: string) {
    const account = await this.accountsRepository.findOne({
      where: { email: email },
    });
    if (!account) {
      throw new Error('Account not found');
    }
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
