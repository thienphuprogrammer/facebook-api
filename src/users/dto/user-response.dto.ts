import { Expose, Type } from 'class-transformer';
import { UserDetailDto } from './user-detail.dto';
import { RoleEnum } from 'src/common/utils';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  role: RoleEnum;

  @Expose()
  @Type(() => UserDetailDto)
  detail?: UserDetailDto;
}
