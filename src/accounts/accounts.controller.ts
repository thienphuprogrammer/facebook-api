import { Controller, Get } from '@nestjs/common';
import { AccountsService } from './accounts.service';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly AccountsService: AccountsService) {}
  @Get('fake100')
  async fake100() {
    await this.AccountsService.fake100();
    return 'fake 100 accounts';
  }
}
