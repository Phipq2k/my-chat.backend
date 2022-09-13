import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigOptionModule } from "@config/config.module";
import { ConfigCustomService } from "@config/config.service";

@Module({
    imports: [
        ConfigOptionModule,
        /* Mongodb Connection */
        MongooseModule.forRootAsync({
            inject: [ConfigCustomService],
            useFactory: async (configService: ConfigCustomService) => configService.getMongodbConfig()
        })
    ]
})
export class DatabaseModule { }