import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { AccountDetailDto } from './account-detail.dto';
import { Type } from 'class-transformer';

export abstract class CreateAccountDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @IsOptional()
  email: string;

  @ApiProperty()
  @IsString()
  @IsStrongPassword()
  @IsNotEmpty()
  @MaxLength(50)
  password: string;

  @ApiProperty({ type: AccountDetailDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => AccountDetailDto)
  detail?: AccountDetailDto;
}
