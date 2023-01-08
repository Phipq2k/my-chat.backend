import { Body, Controller, Get, Param, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './common/decorators';
import { Request, Response } from 'express';
import LocalFilesInterceptor from '@/common/interceptors/file-interceptor.service';
import { AccessTokenGuard } from './common/guards';


type Haha = {
  a: string;
}
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(AccessTokenGuard)
  @Public()
  @Get()
  getHello(@Res() res: Response): string {
    return this.appService.getHello(res);
  }



}
