import { IUsers } from '../../users/interfaces';

export interface IAuthResult {
  user: IUsers;
  accessToken: string;
  refreshToken: string;
}
