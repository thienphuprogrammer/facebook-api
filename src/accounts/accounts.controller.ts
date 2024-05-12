import { Body, Controller, Get, Post } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateAccountDto } from './dto/create-account.dto';

@Controller('accounts')
@ApiTags('accounts')
export class AccountsController {
  constructor(private readonly AccountsService: AccountsService) {}
  @Get('fake100')
  async fake100() {
    await this.AccountsService.fake100();
    return 'fake 100 accounts';
  }

  @Get('allAccounts')
  async allAccounts() {
    return await this.AccountsService.allAccounts();
  }

  @Post('create')
  async create(@Body() dto: CreateAccountDto) {
    // return await this.AccountsService.create();
  }
}
