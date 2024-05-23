import { Field, InputType } from '@nestjs/graphql';
import { IsString, MinLength } from 'class-validator';
import { PasswordsDto } from '../dto/passwords.dto';

@InputType('UpdatePasswordInput')
export abstract class UpdatePasswordInput extends PasswordsDto {
  @Field(() => String)
  @IsString()
  @MinLength(1)
  public password!: string;
}
