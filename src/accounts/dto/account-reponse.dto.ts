import { Expose, Type } from 'class-transformer';
import { AccountDetailDto } from './account-detail.dto';
import { RoleEnum } from 'src/common/utils';

export abstract class AccountResponseDto {
  @Expose()
  id: string;

  @Expose()
  role: RoleEnum;

  @Expose()
  @Type(() => AccountDetailDto)
  detail?: AccountDetailDto;
}
