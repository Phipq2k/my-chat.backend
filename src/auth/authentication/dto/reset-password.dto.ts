import { Match } from "@common/decorators";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MinLength} from "class-validator";

export class ResetPasswordDto{
    @ApiProperty()
    @IsNotEmpty()
    readonly token: string;

    @ApiProperty()
    @IsNotEmpty()
    @MinLength(6)
    readonly user_password: string;

    @ApiProperty()
    @IsNotEmpty()
    @Match('user_password')
    readonly user_confirm_password: string;

}