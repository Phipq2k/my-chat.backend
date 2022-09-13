import { Match } from "@/common/decorators";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEmpty, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class CreateUserDto{
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly user_name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    readonly user_email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly user_password: string;

    @ApiProperty()
    @IsString()
    readonly user_avatar: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @Match('user_password')
    readonly user_confirm_password: string;
}