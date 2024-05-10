import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsOptional, IsString, IsStrongPassword, MaxLength} from "class-validator";

export class AccountDetailDto {
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

    @ApiProperty({type: AccountDetailDto})
    @IsString()
    @IsNotEmpty()
    readonly accountDetail: AccountDetailDto;
}