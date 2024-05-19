import { RoleEnum } from '../../common/utils';
import { ICredentials } from './credentials.interface';

export interface IAccounts {
  id: string;
  email: string;
  password: string;
  role: RoleEnum;
  detail: any;
  confirmed: boolean;
  createdAt: Date;
  updatedAt: Date;
  credentials: ICredentials;
}
