import { IUsers } from '../../users/interfaces';

export interface IBlacklistedToken {
  tokenId: string;
  user: IUsers;
  createdAt: Date;
}
