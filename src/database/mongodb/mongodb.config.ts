import { ConfigCustomService } from "@config/config.service";
import { MongooseModuleOptions } from "@nestjs/mongoose";

export default (config: ConfigCustomService): MongooseModuleOptions => ({
    uri: config.get<string>('DB_HOST'),
    useNewUrlParser: true,
    useUnifiedTopology: true
}); 