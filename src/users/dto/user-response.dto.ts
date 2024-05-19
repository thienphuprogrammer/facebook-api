import { Expose, Type } from 'class-transformer';
import { UserDetailsDto } from './user-details.dto';
import { RoleEnum } from '../../common/utils';

export abstract class AccountResponseDto {
  @Expose()
  id: string;

  @Expose()
  role: RoleEnum;

  @Expose()
  @Type(() => UserDetailsDto)
  detail?: UserDetailsDto;
}
