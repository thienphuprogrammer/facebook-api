import { Field, InputType } from '@nestjs/graphql';
import { IsJWT, IsString } from 'class-validator';
import { PasswordsDto } from '../dto/passwords.dto';

@InputType('ResetPasswordInput')
export abstract class ResetPasswordInput extends PasswordsDto {
  @Field(() => String)
  @IsString()
  @IsJWT()
  public resetToken!: string;
}
