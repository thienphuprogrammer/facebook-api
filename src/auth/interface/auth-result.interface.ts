import { IAccounts } from '../../accounts/interfaces';

export interface IAuthResult {
  account: IAccounts;
  accessToken: string;
  refreshToken: string;
}
