import { ConfigCustomService } from "@/config/config.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { Global, Module } from "@nestjs/common";
import { EmailController } from "./email.controller";
import { EmailService } from "./email.service";

@Global()
@Module({
    imports: [
        MailerModule.forRoot(new ConfigCustomService().getConfigMailer())
    ],
    controllers: [EmailController],
    providers: [
        EmailService
    ],
    exports: [EmailService]
})
export class EmailModule{};