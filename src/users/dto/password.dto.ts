import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export abstract class PasswordDto {
  @Field(() => String)
  @ApiProperty({
    description: 'The password of the user',
    minLength: 1,
    type: String,
  })
  @IsString()
  @MinLength(1)
  public password: string;
}
