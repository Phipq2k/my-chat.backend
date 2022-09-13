import { CreateMessageDto } from '@/chat/dtos/create-message.dto';
import { ChatService } from '@/chat/services/chat.service';
import { GetCurrentUserId, Public } from '@/common/decorators';
import LocalFilesInterceptor from '@/common/interceptors/file-interceptor.service';
import { UserService } from '@/user/user.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { FileMessageDto } from '../dto/message-file.dto';
@Controller('/file')
export class FileController {
  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UserService
    ) {}

  //Avatar file upload
  @UseInterceptors(
    LocalFilesInterceptor({
      fieldName: 'avatar',
      path: '/avatar',
      limits: {
        files: 1,
        fileSize: 1024*1024*25
      }
    }),
  )
  @Post('/upload/avatar')
  @HttpCode(HttpStatus.OK)
  public async uploadAvatar(
    @GetCurrentUserId() userId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Express.Multer.File> {
    await this.userService.uploadAvatarUser(userId, file.filename);

    return file;
  }

  @UseInterceptors(
    LocalFilesInterceptor({
      fieldName: 'fileMessage',
      path: '/message'
    }),
  )
  @Post('/upload/message')
  @HttpCode(HttpStatus.CREATED)
  public async uploadMessageFile(
    @GetCurrentUserId() userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() fileMessageDto: FileMessageDto,
  ): Promise<any> {
    const {conversationId} = fileMessageDto;
    const newMessage: CreateMessageDto = {
      chat_room: conversationId,
      type: file.mimetype.split('/')[0],
      message: file.filename
    }
    const messageFile = await this.chatService.sendMessage(userId, newMessage);
    return {
      file,
      messageFile
    }
  }

  @Public()
  @Get('avatar/:imgPath')
  @HttpCode(HttpStatus.OK)
  public responseAvatar(
    @Param('imgPath') image: string,
    @Res() res: Response,
  ){
    return res.sendFile(image, {
      root: 'src/assets/avatar',
    });
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('message/:imgPath')
  public responseFileMessage(
    @Param('imgPath') image: string,
    @Res() res: Response,
  ){

    return  res.sendFile(image, {
      root: 'src/assets/message',
    });
  }
  
}
