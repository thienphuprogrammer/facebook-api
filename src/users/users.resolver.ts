import {
  Args,
  Context,
  Mutation,
  Query,
  ResolveReference,
  Resolver,
} from '@nestjs/graphql';
import { UsersEntity } from './entities';
import { UsersService } from './users.service';
import { Public } from '../auth/decorators/public.decorator';
import { IdDto } from '../common/dto/id,dto';
import { UsernameDto } from './dto/username.dto';
import { ConfigService } from '@nestjs/config';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { MessageType } from '../common/entities/gql/message.type';
import { PasswordDto } from './dto/password.dto';
import { FastifyReply } from 'fastify';
import { ChangeEmailDto } from './dto/change-email.dto';
import { NameDto } from './dto/name.dto';
import { IFederatedInstance } from '../common/interfaces/dederated-instance.interface';

@Resolver(() => UsersEntity)
export class UsersResolver {
  private readonly cookiePath = '/api/graphql';
  private readonly cookieName: string;
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService
  ) {
    this.cookieName = this.configService.get<string>('REFRESH_COOKIE');
  }

  @Public()
  @Query(() => UsersEntity)
  public async userById(@Args() idDto: IdDto): Promise<UsersEntity> {
    return this.usersService.findOneById(idDto.id);
  }

  @Public()
  @Query(() => UsersEntity)
  public async userByUsername(
    @Args() usernameDto: UsernameDto
  ): Promise<UsersEntity> {
    return await this.usersService.findOneByUsername(usernameDto.username);
  }

  @Mutation(() => MessageType)
  public async deleteUser(
    @Context('res') res: FastifyReply,
    @CurrentUser() id: number,
    @Args() passwordDto: PasswordDto
  ): Promise<MessageType> {
    await this.usersService.delete(id, passwordDto);
    res.clearCookie(this.cookieName, { path: this.cookiePath });
    return new MessageType('User deleted successfully');
  }

  @Mutation(() => UsersEntity)
  public async updateUserEmail(
    @CurrentUser() id: number,
    @Args() changeEmailDto: ChangeEmailDto
  ): Promise<UsersEntity> {
    return await this.usersService.updateEmail(id, changeEmailDto);
  }

  @Mutation(() => UsersEntity)
  public async updateUserName(
    @CurrentUser() id: number,
    @Args() nameDto: NameDto
  ): Promise<UsersEntity> {
    return await this.usersService.updateName(id, nameDto.name);
  }

  @Mutation(() => UsersEntity)
  public async updateUserUsername(
    @CurrentUser() id: number,
    @Args() usernameDto: UsernameDto
  ): Promise<UsersEntity> {
    return await this.usersService.updateUsername(id, usernameDto.username);
  }

  @ResolveReference()
  public async resolveReference(
    reference: IFederatedInstance<'User'>
  ): Promise<UsersEntity> {
    return this.usersService.findOneById(reference.id);
  }
}
