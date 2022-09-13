import { Socket } from "socket.io";

export type AuthInfo = {
    user_id: string;
    access_token: string;
    refresh_token: string;
}

export type JwtPayload = {
    sub: string;
    email: string;
}