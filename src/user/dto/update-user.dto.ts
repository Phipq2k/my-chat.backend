import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateUserDto {
    @ApiProperty()
    @IsString()
    user_name: string;

    @ApiProperty()
    @IsString()
    user_email: string;
}