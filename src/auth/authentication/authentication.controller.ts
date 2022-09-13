import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { GetCurrentUser, GetCurrentUserId, Public } from '@common/decorators';
import { RefreshTokenGuard } from '@common/guards';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { AuthInfo } from '@/common/types/auth.type';
import { AuthenticationService } from '@auth/authentication/authentication.service';
import { SigninDto } from '@auth/authentication/dto/signin.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('authentication')
export class AuthenticationController {
    constructor(private readonly authenticationService: AuthenticationService) { }

    @Public()
    @Post('/local/signup')
    @HttpCode(HttpStatus.CREATED)
    public async registerLocalAccount(@Body() createUserDto: CreateUserDto): Promise<AuthInfo> {
        return await this.authenticationService.registerLocalAccount(createUserDto);
    }

    @Public()
    @Post('/local/signin')
    @HttpCode(HttpStatus.OK)
    public async loginLocalAccount(@Body() signinDto: SigninDto): Promise<AuthInfo> {
        return await this.authenticationService.loginLocalAccount(signinDto);
    }

    @Post('/signout')
    @HttpCode(HttpStatus.OK)
    public async logoutAccount(@GetCurrentUserId() userId: string): Promise<string> {
        return await this.authenticationService.logoutLocalAccount(userId);
    }


    @Public()
    @Post('/forgot-password')
    @HttpCode(HttpStatus.OK)
    public async forgotPassword(@Body() { user_email }: ForgotPasswordDto): Promise<string>{
        return await this.authenticationService.forgotPassword({ user_email });
    }

    @Public()
    @HttpCode(HttpStatus.ACCEPTED)
    @Post('/reset-password')
    public async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<string> {
        return await this.authenticationService.resetPassword(resetPasswordDto);
    }


    @Public()
    @UseGuards(RefreshTokenGuard)
    @Post('/refresh')
    @HttpCode(HttpStatus.ACCEPTED)
    public async refreshToken(
        @GetCurrentUserId() userId: string,
        @GetCurrentUser('refreshToken') refreshToken: string
    ): Promise<AuthInfo> {
        return await this.authenticationService.refreshToken(userId, refreshToken);
    }
}