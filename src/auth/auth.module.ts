import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { UserModule } from "@user/user.module";
import { AuthenticationController } from "./authentication/authentication.controller";
import { AuthenticationService } from "./authentication/authentication.service";
import { AccessTokenStrategy } from "../common/strategies/access-token.strategy";
import { RefreshTokenStrategy } from "../common/strategies/refresh-token.strategy";
import { APP_GUARD } from "@nestjs/core";
import { AccessTokenGuard } from "@/common/guards";

@Module({
    imports: [
        JwtModule.register({}),
        UserModule,
    ],
    controllers: [AuthenticationController],
    providers: [
        AuthenticationService,
        AccessTokenStrategy,
        RefreshTokenStrategy,
        {
            provide: APP_GUARD,
            useClass: AccessTokenGuard
        }],
    exports: [AuthenticationService]
})
export class AuthModule { }