import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsString } from 'class-validator';
import { PasswordsDto } from './passwords.dto';
import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export abstract class ResetPasswordDto extends PasswordsDto {
  @Field(() => String)
  @ApiProperty({
    description: 'The JWT token sent to the user email',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    type: String,
  })
  @IsString()
  @IsJWT()
  public resetToken!: string;
}
