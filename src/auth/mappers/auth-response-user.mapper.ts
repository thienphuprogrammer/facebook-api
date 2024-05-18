import { IAuthResponseUser } from '../interface/auth-response-user.interface';
import { IUsers } from '../../users/interfaces';

export class AuthResponseUserMapper implements IAuthResponseUser {
  public id: number;
  public name: string;
  public username: string;
  public email: string;
  public createdAt: string;
  public updatedAt: string;

  constructor(values: IAuthResponseUser) {
    Object.assign(this, values);
  }

  public static map(user: IUsers): AuthResponseUserMapper {
    return new AuthResponseUserMapper({
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    });
  }
}
