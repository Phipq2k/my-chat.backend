import { IsObjectId } from "@/common/decorators";
import { User } from "@/user/user.schema";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateSingleConversationDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsObjectId()
    readonly partner: User;
}