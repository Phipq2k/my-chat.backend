import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bycript from 'bcrypt';
import { ConfigCustomService } from '@config/config.service';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { UserService } from '@user/user.service';
import { SigninDto } from './dto/signin.dto';
import { AuthInfo } from '@/common/types/auth.type';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { EmailService } from '@/email/email.service';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthenticationService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigCustomService,
        private readonly emailService: EmailService) { }

    private async hashData(data: string): Promise<string> {
        return await bycript.hash(data, 10);
    }



    //Tokens generation
    private async getTokens(userId: string, email: string): Promise<AuthInfo> {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync({
                sub: userId,
                email
            }, {
                secret: this.configService.get('ACCESS_TOKEN_SECRET'),
                expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRESIN')
            }),
            this.jwtService.signAsync({
                sub: userId,
                email
            }, {
                secret: this.configService.get('REFRESH_TOKEN_SECRET'),
                expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRESIN')
            })

        ]);

        return {
            user_id: userId,
            access_token: at,
            refresh_token: rt
        }
    }

    private async updateRefreshTokenHash(userId: string, rt: string) {
        const hash = await this.hashData(rt);
        await this.userService.updateUser({_id: userId}, { hashedRt: hash });
    }

    private async updateResetToken(userId: string, resetToken: string) {
       await this.userService.updateUser({_id: userId}, { reset_token: resetToken });
       setTimeout(async () => {
        await this.userService.updateUser({_id: userId}, { reset_token: null });
       },60000*15);
    }


    public async registerLocalAccount(createUserDto: CreateUserDto): Promise<AuthInfo> {
        const { user_name, user_email, user_password, user_confirm_password, ...userDto } = createUserDto;
        const user = await this.userService.getUser({user_email});
        if (user) throw new ForbiddenException('Email này đã được sử dụng');
        const user_avatar = '';
        const hashPassword = await this.hashData(user_password);
        const newUser = await this.userService.addUser({
            user_name,
            user_email,
            user_password: hashPassword,
            ...userDto
        });

        const authInfo = await this.getTokens(newUser._id.toString(), newUser.user_email);
        await this.updateRefreshTokenHash(newUser._id.toString(), authInfo.refresh_token);
        await this.updateResetToken(newUser._id.toString(), null);
        return authInfo;

    }

    public async loginLocalAccount(signinDto: SigninDto): Promise<AuthInfo> {
        const {user_email, user_password} = signinDto;
        const user = await this.userService.getUser({user_email});
        //Check user not exist
        if (!user) throw new BadRequestException('Tài khoản không tồn tại');

        //Check hashed password
        const passwordMatch = await bycript.compare(user_password, user.user_password);
        if (!passwordMatch) throw new ForbiddenException('Mật khẩu không chính xác');

        //update refresh token
        const authInfo = await this.getTokens(user._id.toString(), user.user_email);
        await this.updateRefreshTokenHash(user._id.toString(), authInfo.refresh_token);
        return authInfo;

    }


    public async logoutLocalAccount(userId: string): Promise<string> {
        /* Check value of hahsedRt that it's null */
        await this.userService.updateUser({
            _id: userId,
            hashedRt: {
                $ne: null
            }
        }, { hashedRt: null });
        return 'Đăng xuất thành công';
    }

    public async refreshToken(userId: string, rt: string): Promise<AuthInfo> {
        const user = await this.userService.getUserById(userId);
        if (!user) throw new ForbiddenException('Không tìm thấy tài khoản');
        const rtMatch = await bycript.compare(rt, user.hashedRt);
        if (!rtMatch) throw new ForbiddenException('Mã không hợp lệ')
        //update refresh token
        const authInfo = await this.getTokens(user._id.toString(), user.user_email);
        await this.updateRefreshTokenHash(user._id.toString(), authInfo.refresh_token);
        return authInfo;
    }


    public async forgotPassword({ user_email }: ForgotPasswordDto): Promise<string> {
        const user = await this.userService.getUser({user_email});
        if (!user) throw new BadRequestException('Tài khoản không tồn tại');
        const token = Math.random().toString(20).substring(2, 8);
        await this.emailService.sendUserConfirmation(user, token);
        await this.updateResetToken(user._id.toString(), token);
        return 'Vui lòng kiểm tra email của bạn'
    }

    public async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<string> {
        const {user_password, token} = resetPasswordDto;

        const user = await this.userService.getUser({reset_token: token});
        if (!user) {
            throw new BadRequestException('Thay đổi mật khẩu thất bại');
        }
        const hashPassword = await this.hashData(user_password);
        await this.userService.updateUser({_id: user._id.toString()}, {user_password: hashPassword, reset_token: null});
        return 'Thay đổi mật khẩu thành công'
    }

}