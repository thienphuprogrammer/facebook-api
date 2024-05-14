import { Expose, Type } from 'class-transformer';
import { AccountDetailDto } from './account-detail.dto';
import { RoleEnum } from '@utils';

export class AccountResponseDto {
  @Expose()
  id: string;

  @Expose()
  role: RoleEnum;

  @Expose()
  @Type(() => AccountDetailDto)
  detail?: AccountDetailDto;
}
