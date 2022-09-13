import { IsObjectId } from "@/common/decorators";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty} from "class-validator";

export class CreateMessageDto{
    @ApiProperty()
    @IsNotEmpty()
    @IsObjectId()
    readonly chat_room: string;

    @ApiProperty()
    readonly type?: string;

    @ApiProperty()
    @IsNotEmpty()
    readonly message: string;
}