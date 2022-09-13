import { Public } from '@/common/decorators';
import { Controller, Get } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('/email')
export class EmailController {
    constructor(private readonly emailService: EmailService){}

    @Public()
    @Get('/send-email')
    public async sendEmail(){
        // return 'Hello Email';
        // return await this.emailService.sendUserConfirmation();
    }
}