import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SigninDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    user_email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    user_password: string;
}