import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto, AccountResponseDto } from './dto';
import { DtoMapper } from '../common/utils';
import ResponseObject from '../common/utils/response-object';

@Controller('accounts')
@ApiTags('accounts')
export class UsersController {
  constructor(private readonly AccountsService: UsersService) {}
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

  // @Get('allAccounts')
  // async allAccounts() {
  //   return new ResponseObject(
  //     HttpStatus.OK,
  //     'Get all accounts',
  //     DtoMapper.mapMany(
  //       await this.UsersService.allAccounts(),
  //       AccountResponseDto
  //     ),
  //     null
  //   );
  // }

  // @Post('create')
  // async create(@Body() dto: CreateUserDto) {
  //   const account = await this.UsersService.create(dto);
  //   if (!account) {
  //     return new ResponseObject(
  //       HttpStatus.BAD_REQUEST,
  //       'Create account failed',
  //       null,
  //       null
  //     );
  //   }
  //
  //   return new ResponseObject(
  //     HttpStatus.OK,
  //     'Create account success',
  //     DtoMapper.mapOne(account, AccountResponseDto),
  //     null
  //   );
  // }
}
