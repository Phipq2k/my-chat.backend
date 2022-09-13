import { Conversation } from '@/chat/schemas/conversation.schema';
import { User } from '@/user/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import mongoose, { Document, ObjectId } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: { createdAt: 'createdAt' } })
export class Message {
  @Transform(({ value }) => value.toString())
  _id?: ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Conversation.name })
  @Type(() => Conversation)
  chat_room: Conversation;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  @Type(() => User)
  sender: User;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  message: string;

  @Prop({
    required: true,
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: User.name,
      },
    ],
  })
  @Type(() => User)
  seen: User[];

  @Prop()
  createdAt?: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
