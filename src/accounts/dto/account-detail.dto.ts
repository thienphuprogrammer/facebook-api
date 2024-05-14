import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Expose } from 'class-transformer';

export class AccountDetailDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Expose()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Expose()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Expose()
  nickName: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Expose()
  age: number;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  @Expose()
  birthday: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Expose()
  number_phone: string;
}
