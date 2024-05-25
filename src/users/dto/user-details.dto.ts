import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export abstract class UserDetailsDto {
  @Field(() => String)
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Expose()
  firstName: string;

  @Field(() => String)
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Expose()
  lastName: string;

  @Field(() => String)
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Expose()
  nickName: string;

  @Field(() => Number)
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Expose()
  age: number;

  @Field(() => Date)
  @ApiProperty()
  @IsDate()
  @IsOptional()
  @Expose()
  birthday: Date;

  @Field(() => String)
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Expose()
  number_phone: string;
}
