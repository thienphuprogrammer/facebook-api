import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches, ValidateIf } from 'class-validator';
import { NAME_REGEX, SLUG_REGEX } from '../../common/consts/regex.const';
import { isUndefined } from '@nestjs/common/utils/shared.utils';
import { isNull } from '../../common/utils/validation.util';
import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export abstract class UpdateUserDto {
  @Field(() => String, { nullable: true })
  @ApiProperty({
    description: 'The new username',
    example: 'new-username',
    type: String,
  })
  @IsString()
  @Length(3, 106)
  @Matches(SLUG_REGEX, {
    message: 'Username must be a valid slugs',
  })
  @ValidateIf(
    (o: UpdateUserDto) =>
      !isUndefined(o.username) || isUndefined(o.name) || isNull(o.name)
  )
  public username?: string;

  @Field(() => String, { nullable: true })
  @ApiProperty({
    description: 'The new name',
    example: 'John Doe',
    type: String,
  })
  @IsString()
  @Length(3, 100)
  @Matches(NAME_REGEX, {
    message: 'Name must not have special characters',
  })
  @ValidateIf(
    (o: UpdateUserDto) =>
      !isUndefined(o.name) || isUndefined(o.username) || isNull(o.username)
  )
  public name?: string;
}
