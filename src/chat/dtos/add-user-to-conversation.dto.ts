import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class AddUserToConversationDto {
    @ApiProperty()
    @IsNotEmpty()
    readonly partnerId: string;

    @ApiProperty()
    @IsNotEmpty()
    readonly message: string;

}