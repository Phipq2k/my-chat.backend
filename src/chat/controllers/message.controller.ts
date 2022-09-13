import { GetCurrentUserId, Public } from '@/common/decorators';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateMessageDto } from '../dtos/create-message.dto';
import { Message } from '../schemas/message.schema';
import { ChatService } from '../services/chat.service';

// @UseGuards(CheckUserInRoomGuard)
@Controller('/message')
export class MessageController {
  constructor(private readonly chatService: ChatService) {}

  @Get('/all/:roomId')
  @HttpCode(HttpStatus.OK)
  public async getAllMessages(
    @GetCurrentUserId() userId: string,
    @Param('roomId') roomId: string,
  ): Promise<Message[]> {
    return await this.chatService.getAllMessages(userId, roomId);
  }

  @Post('/send')
  public async sendMessage(
    @GetCurrentUserId() userId: string,
    @Body() message: CreateMessageDto,
  ): Promise<Message> {
    return await this.chatService.sendMessage(userId, message);
  }

  // @Public()
  // @Get('/remove-all')
  // public async removeAllMessages(): Promise<boolean> {
  //   return await this.chatService.removeAllMessages();
  // }
}
