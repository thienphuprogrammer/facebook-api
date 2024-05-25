import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export abstract class GetUserParams {
  @Field(() => String)
  @ApiProperty({
    description: 'The id or username of the user',
    type: String,
    example: "1 or 'username'",
  })
  @IsString()
  @Length(1, 106)
  public idOrUsername: string;
}
