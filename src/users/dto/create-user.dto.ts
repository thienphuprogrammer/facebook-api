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

export abstract class CreateUserDto {
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

  @ApiProperty({ type: UserDetailsDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserDetailsDto)
  detail?: UserDetailsDto;
}
