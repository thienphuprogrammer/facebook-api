import { IAccounts } from '../../accounts/interfaces';

export interface IBlacklistedToken {
  tokenId: string;
  user: IAccounts;
  createdAt: Date;
}
