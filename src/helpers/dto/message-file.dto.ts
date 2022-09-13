import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty} from "class-validator";

export class FileMessageDto {
    @ApiProperty()
    @IsNotEmpty()
    readonly conversationId: string;
}