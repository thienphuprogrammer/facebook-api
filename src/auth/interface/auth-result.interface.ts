import { IAccounts } from '../../accounts/interfaces';

export interface IAuthResult {
  user: IAccounts;
  accessToken: string;
  refreshToken: string;
}
