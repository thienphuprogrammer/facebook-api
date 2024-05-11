import { RoleEnum } from '@utils';

export class AuthTokenReturnDto {
  timestamp: Date;
  accessToken: string;
  refreshToken: string;
  role: RoleEnum;

  constructor(accessToken: string, role: RoleEnum) {
    this.timestamp = new Date();
    this.accessToken = accessToken;
    this.role = role;
  }

  setRefreshToken(refreshToken: string): this {
    this.refreshToken = refreshToken;
    return this;
  }
}
