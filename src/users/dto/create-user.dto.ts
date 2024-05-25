import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { UserDetailsDto } from './user-details.dto';
import { Type } from 'class-transformer';
import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export abstract class CreateUserDto {
  @Field(() => String)
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @IsOptional()
  email: string;

  @Field(() => String)
  @ApiProperty()
  @IsString()
  @IsStrongPassword()
  @IsNotEmpty()
  @MaxLength(50)
  password: string;

  @Field(() => UserDetailsDto)
  @ApiProperty({ type: UserDetailsDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserDetailsDto)
  detail?: UserDetailsDto;
}
