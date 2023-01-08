import { ConfigCustomService } from '@/config/config.service';
import { ForbiddenException, INestApplicationContext, Logger} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { NextFunction } from 'express';
import { Server, ServerOptions } from 'socket.io';

export class SocketIoAdapter extends IoAdapter {
  constructor(
    private app: INestApplicationContext,
    private configService: ConfigCustomService,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const clientPort = this.configService.get<number>('CLIENT_PORT');
    const socketPort = this.configService.get<number>('SOCKETIO_SERVER_PORT');
    const cors = {
      origin: [
        `http://localhost:${clientPort}`,
        new RegExp(`/http:\/\/192\.168\.1\.([1-9][1-9]\d):${clientPort}`)
      ]
    }


    const optionWithCors: ServerOptions = {
      ...options,
      cors
    }

    const server: Server = super.createIOServer(socketPort, optionWithCors);
    return server;
  }

}