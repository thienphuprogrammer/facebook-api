import { RoleEnum } from '../../common/utils';
import { ICredentials } from './credentials.interface';

export interface IUsers {
  id: number;
  email: string;
  password: string;
  name: string;
  username: string;
  role: RoleEnum;
  // detail: any;
  confirmed: boolean;
  createdAt: Date;
  updatedAt: Date;
  credentials: ICredentials;
}
