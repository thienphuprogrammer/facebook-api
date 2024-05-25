import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PasswordsDto } from './passwords.dto';
import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export abstract class ChangePasswordDto extends PasswordsDto {
  @Field(() => String)
  @ApiProperty({
    description: 'The current password',
    minLength: 1,
    type: String,
  })
  @IsString()
  @IsOptional()
  public password!: string;
}
