import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserResponseDto } from './dto';
import { DtoMapper } from 'src/common/utils';
import ResponseObject from '../common/utils/response-object';
import { ConfigService } from '@nestjs/config/dist';
import { Public } from '../decorators/public.decorator';
import { GetUserParams } from './dto/get-user.params';
import { IResponseUser } from './interfaces/response-user.interface';
import { ResponseUserMapper } from './mappers/response-user.mapper';
import { CurrentUser } from '../decorators/current-user.decorator';
import { ChangeEmailDto } from './dto/change-email.dto';
import { IAuthResponseUser } from '../auth/interface/auth-response-user.interface';
import { AuthResponseUserMapper } from '../auth/mappers/auth-response-user.mapper';
import { PasswordDto } from './dto/password.dto';
import { Request, Response } from 'express-serve-static-core';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  private cookiePath = '/users';
  private cookieName: string;

  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService
  ) {
    this.cookieName = this.configService.get<string>('COOKIE_NAME');
  }

  @Get('fake100')
  async fake100() {
    await this.usersService.fake100();
    return new ResponseObject(
      HttpStatus.OK,
      'Create 100 fake users',
      null,
      null
    );
  }

  @Get('allUsers')
  async allUsersUsers() {
    return new ResponseObject(
      HttpStatus.OK,
      'Get all users',
      DtoMapper.mapMany(await this.usersService.allUsers(), UserResponseDto),
      null
    );
  }

  @Public()
  @Get('/:idOrUsername')
  @ApiOkResponse({
    type: ResponseUserMapper,
    description: 'The user is found and returned.',
  })
  @ApiBadRequestResponse({
    description: 'Something is invalid on the request body',
  })
  @ApiNotFoundResponse({
    description: 'The user is not found.',
  })
  public async getUser(@Param() params: GetUserParams): Promise<IResponseUser> {
    const user = await this.usersService.findOneByIdOrUsername(
      params.idOrUsername
    );
    return ResponseUserMapper.map(user);
  }

  @Patch('/email')
  @ApiOkResponse({
    type: AuthResponseUserMapper,
    description: 'The email is updated, and the user is returned.',
  })
  @ApiBadRequestResponse({
    description: 'Something is invalid on the request body, or wrong password.',
  })
  @ApiUnauthorizedResponse({
    description: 'The user is not logged in.',
  })
  public async updateEmail(
    @CurrentUser() id: number,
    @Body() dto: ChangeEmailDto
  ): Promise<IAuthResponseUser> {
    const user = await this.usersService.updateEmail(id, dto);
    return AuthResponseUserMapper.map(user);
  }

  // @Patch()
  // @ApiOkResponse({
  //   type: ResponseUserMapper,
  //   description: 'The username is updated.',
  // })
  // @ApiBadRequestResponse({
  //   description: 'Something is invalid on the request body.',
  // })
  // @ApiUnauthorizedResponse({
  //   description: 'The user is not logged in.',
  // })
  // public async updateUser(
  //   @CurrentUser() id: number,
  //   @Body() dto: UpdateUserDto
  // ): Promise<IResponseUser> {
  //   const user = await this.usersService.update(id, dto);
  //   return ResponseUserMapper.map(user);
  // }

  @Delete()
  @ApiNoContentResponse({
    description: 'The user is deleted.',
  })
  @ApiBadRequestResponse({
    description: 'Something is invalid on the request body, or wrong password.',
  })
  @ApiUnauthorizedResponse({
    description: 'The user is not logged in.',
  })
  public async deleteUser(
    @CurrentUser() id: number,
    @Body() dto: PasswordDto,
    @Res() res: Response
  ): Promise<void> {
    await this.usersService.delete(id, dto);
    res
      .clearCookie(this.cookieName, { path: this.cookiePath })
      .status(HttpStatus.NO_CONTENT)
      .send();
  }
}
