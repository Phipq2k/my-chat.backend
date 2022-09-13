import { SearchModule } from "@/search/search.module";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserController } from "./user.controller";
import { UserRepoSitory } from "./user.repository";
import { User, UserSchema } from "./user.schema";
import { UserService } from "./user.service";

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: User.name,
            schema: UserSchema
        }]),
        // SearchModule
    ],
    controllers: [UserController],
    providers: [UserService, UserRepoSitory],
    exports: [UserService, UserRepoSitory]
})
export class UserModule{}