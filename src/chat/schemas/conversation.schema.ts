import { LastMessage } from "@/common/types/chat.type";
import { User } from "@/user/user.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Transform, Type } from "class-transformer";
import mongoose, { Document, ObjectId } from "mongoose";
import { Factory } from "nestjs-seeder";

export type ConversationDocument = Conversation & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Conversation {
    @Transform(({ value }) => value.toString())
    _id?: ObjectId;
    @Prop()
    chat_room_name: string;

    @Prop()
    chat_room_image: string;

    @Prop({type: LastMessage})
    @Type(() => LastMessage)
    last_message: LastMessage;

    @Prop({
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: User.name
            }
        ], required: true
    })
    @Type(() => User)
    participants: User[];

    @Prop()
    createdAt?: string;

    @Prop()
    updatedAt?: string;


}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);