import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Transform } from "class-transformer";
import { ObjectId, Document } from "mongoose";
import { ExcludeProperty } from "nestjs-mongoose-exclude";
import { Factory } from "nestjs-seeder";

export type UserDocument = User & Document;


@Schema({timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'}})
export class User {

    @Transform(({value}) => value.toString())
    _id?: ObjectId;
    
    // @Factory(faker => faker.name.findName())
    @Prop({required: true})
    user_name: string;

    // @Factory('tranquocphipq@gmail.com')
    @Prop({required: true})
    user_email: string;

    // @Factory(faker => faker.internet.email())
    @Prop({required: true})
    @ExcludeProperty()
    user_password: string;

    @Prop()
    socketId?: string;

    // @Factory(faker => faker.internet.password())
    @Prop()
    @ExcludeProperty()
    hashedRt?: string;
    
    // @Factory(faker => faker.image.image())
    @Prop()
    user_avatar: string;

    @Prop()
    @ExcludeProperty()
    reset_token?: string;

    @Prop()
    createdAt?: string;

    @Prop()
    updatedAt?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);