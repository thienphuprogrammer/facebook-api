import { IAuthResponse } from '../interface/auth-response.interface';
import { AuthResponseUserMapper } from './auth-response-user.mapper';
import { IAuthResult } from '../interface/auth-result.interface';

export class AuthResponseMapper implements IAuthResponse {
  public user: AuthResponseUserMapper;
  public accessToken: string;

  constructor(values: IAuthResponse) {
    Object.assign(this, values);
  }

  public static map(result: IAuthResult): AuthResponseMapper {
    return new AuthResponseMapper({
      user: AuthResponseUserMapper.map(result.user),
      accessToken: result.accessToken,
    });
  }
}
