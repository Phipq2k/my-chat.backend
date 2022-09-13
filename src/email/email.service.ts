import { User } from "@/user/user.schema";
import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailService{
    constructor(private readonly mailerService: MailerService) {}

    public async sendUserConfirmation(user: User, token: string): Promise<boolean> {
        const url = `http://localhost:3000/reset-password/${token}`;
        const {user_email} = user;
        await this.mailerService.sendMail({
            to: user_email,
            subject: 'Thay đổi mật khẩu',
            html: `Thay đổi mật khẩu của bạn <a href="${url}" style="text-decorator: none"><b>tại đây<b></a>`
        });
        return true;
    }
}