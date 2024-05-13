import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class AccountDetailDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @MaxLength(50)
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @MaxLength(50)
  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @MaxLength(50)
  @IsNotEmpty()
  readonly nickName: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  readonly age: number;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  @IsNotEmpty()
  readonly birthday: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @MaxLength(50)
  readonly number_phone: string;
}
