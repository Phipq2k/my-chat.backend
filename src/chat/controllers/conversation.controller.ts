import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { Conversation } from '@/chat/schemas/conversation.schema';
import { GetCurrentUserId, Public } from '@/common/decorators';
import { CreateSingleConversationDto } from '../dtos/create-single-conversation.dto';
import { ChatService } from '../services/chat.service';
import { AddUserToConversationDto } from '../dtos/add-user-to-conversation.dto';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly chatService: ChatService) {}

  @Get('all')
  @HttpCode(HttpStatus.OK)
  public async getAllConversations(
    @GetCurrentUserId() userId: string,
  ): Promise<Conversation[]> {
    return await this.chatService.getAllConversation(userId);
  }

  @Post('/create-single')
  @HttpCode(HttpStatus.CREATED)
  public async createSingleConversation(
    @GetCurrentUserId() userId: string,
    @Body() { partner }: CreateSingleConversationDto,
  ): Promise<Conversation> {
    return await this.chatService.createSingleConversation(
      userId,
      partner._id.toString(),
    );
  }

  //Todo: Add user to conversation in both isn't friend case
  @Post('/add-user')
  @HttpCode(HttpStatus.CREATED)
  public async addUserToConversation(
    @GetCurrentUserId() userId: string,
    @Body() addUserToConversationDto: AddUserToConversationDto,
  ): Promise<Conversation> {
    return await this.chatService.addUserToConversation(
      userId,
      addUserToConversationDto,
    );
  }

  // @Public()
  // @Delete('/remove-all')
  // @HttpCode(HttpStatus.ACCEPTED)
  // public async removeAllConversation(): Promise<boolean> {
  //   return await this.chatService.removeAllConversations();
  // }
}
