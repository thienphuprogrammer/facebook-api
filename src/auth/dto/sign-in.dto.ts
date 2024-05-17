import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { PasswordsDto } from './passwords.dto';

export abstract class SignInDto extends PasswordsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly email: string;
}
