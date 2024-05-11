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

export class CreateAccountDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @IsOptional()
  readonly email: string;

  @ApiProperty()
  @IsString()
  @IsStrongPassword()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({ type: AccountDetailDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => AccountDetailDto)
  readonly detail: AccountDetailDto;
}
