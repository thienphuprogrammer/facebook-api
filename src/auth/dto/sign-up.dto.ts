import { PasswordsDto } from './passwords.dto';

export abstract class SignUpDto extends PasswordsDto {
  email: string;
  firstName: string;
  lastName: string;
  nickName: string;
  number_phone: string;
  birthday: Date;
  age: number;
  avatar: string;
}
