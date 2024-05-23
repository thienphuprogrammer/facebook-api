import { Field, ObjectType } from '@nestjs/graphql';
import { UsersEntity } from '@users';
import { IUsers } from '../../../users/interfaces';

@ObjectType('Auth')
export abstract class AuthType {
  @Field(() => UsersEntity)
  public user: IUsers;

  @Field(() => String)
  public accessToken: string;
}
