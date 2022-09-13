import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import * as Joi from '@hapi/joi';
import { ConfigCustomService } from "./config.service";

@Global()
@Module({
    imports: [ConfigModule.forRoot({
        validationSchema: Joi.object({
            UPLOADED_FILES_DESTINATION: Joi.string().required(),
            MAIL_HOST: Joi.string().required(),
            MAIL_USER: Joi.string().required(),
            ELASTICSEARCH_NODE: Joi.string().required(),
            ELASTICSEARCH_INDEX: Joi.string().required()
        })
    })],
    providers: [
        {
            provide: ConfigCustomService,
            useValue: new ConfigCustomService()
        }
    ],
    exports: [ConfigCustomService]
})
export class ConfigOptionModule { }