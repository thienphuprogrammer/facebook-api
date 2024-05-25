import { Expose, Type } from 'class-transformer';
import { UserDetailsDto } from './user-details.dto';
import { RoleEnum } from '../../common/utils';
import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export abstract class AccountResponseDto {
  @Field(() => String)
  @Expose()
  id: string;

  @Field(() => String)
  @Expose()
  role: RoleEnum;

  @Field(() => String)
  @Expose()
  @Type(() => UserDetailsDto)
  detail?: UserDetailsDto;
}
