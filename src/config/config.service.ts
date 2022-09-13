import { MailerOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';
export class ConfigCustomService extends ConfigService{
    constructor(){
        super();
    }

    public getPortConfig(): number {
        return this.get<number>('APP_PORT');
    }

    public uploadFileDestination(): string{
        return this.get('UPLOADED_FILES_DESTINATION');
    }

    public getConfigMailer(): MailerOptions{
        return {
            transport: {
                host: this.get<string>('MAIL_HOST'),
                secure: false,
                auth: {
                    user: this.get<string>('MAIL_USER'),
                    pass: this.get<string>('MAIL_PASSWORD')
                }
            },
            defaults: {
                from: `"No Reply" <${this.get<string>('MAIL_FROM')}>`,
            },
        }
    }


    public getMongodbConfig(): MongooseModuleOptions | Promise<MongooseModuleOptions>{
        return {
            uri: this.get<string>('DB_HOST'),
            useNewUrlParser: true,
            useUnifiedTopology: true
        }; 
    }

    public elasticSearchConfig(){
        return {
            node: this.get<string>('ELASTICSEARCH_NODE'),
            index: this.get<string>('ELASTICSEARCH_INDEX')
        }
    }
}