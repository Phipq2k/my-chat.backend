import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable } from "@nestjs/common";
import { ConfigCustomService } from "@config/config.service";
import { Request } from "express";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(){
        const configService = new ConfigCustomService();
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('REFRESH_TOKEN_SECRET'),
            passReqToCallback: true
        });
    }

    validate(req: Request,payload: any){
        const refreshToken = req.get('authorization').replace('Bearer','').trim();
        return {
            ...payload,
            refreshToken
        };
    }
}