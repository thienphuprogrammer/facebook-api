import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateAccountDto } from './dto/create-account.dto';
import { DtoMapper } from 'src/common/utils';
import { AccountResponseDto } from './dto/account-reponse.dto';
import ResponseObject from '../common/utils/response-object';

@Controller('accounts')
@ApiTags('accounts')
export class AccountsController {
  constructor(private readonly AccountsService: AccountsService) {}
  @Get('fake100')
  async fake100() {
    await this.AccountsService.fake100();
    return new ResponseObject(
      HttpStatus.OK,
      'Create 100 fake accounts',
      null,
      null
    );
  }

  @Get('allAccounts')
  async allAccounts() {
    return new ResponseObject(
      HttpStatus.OK,
      'Get all accounts',
      DtoMapper.mapMany(
        await this.AccountsService.allAccounts(),
        AccountResponseDto
      ),
      null
    );
  }

  @Post('create')
  async create(@Body() dto: CreateAccountDto) {
    const account = await this.AccountsService.create(dto);
    if (!account) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Create account failed',
        null,
        null
      );
    }

    return new ResponseObject(
      HttpStatus.OK,
      'Create account success',
      DtoMapper.mapOne(account, AccountResponseDto),
      null
    );
  }
}
