import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';
import { PasswordDto } from './password.dto';
import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export abstract class ChangeEmailDto extends PasswordDto {
  @Field(() => String)
  @ApiProperty({
    description: 'The email of the user',
    example: 'someone@gmail.com',
    minLength: 5,
    maxLength: 255,
    type: String,
  })
  @IsString()
  @IsEmail()
  @Length(5, 255)
  public email: string;
}
