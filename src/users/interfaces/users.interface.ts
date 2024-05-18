import { RoleEnum } from '../../common/utils';
import { CredentialsEmbeddable } from 'src/users';
import { IUserDetails } from './user-details.interface';

export interface IUsers {
  id: number;
  username: string;
  email: string;
  password: string;
  role: RoleEnum;
  detail: IUserDetails;
  confirmed: boolean;
  createdAt: Date;
  updatedAt: Date;
  credentials: CredentialsEmbeddable;
}
