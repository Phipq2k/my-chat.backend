import { MessageType } from '@/common/enums/file-type.enum';
import { User } from '@/user/user.schema';
import { UserService } from '@/user/user.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateMessageDto } from '../dtos/create-message.dto';
import { ConversationRepository } from '../repositories/conversation.repository';
import { Message } from '../schemas/message.schema';
import { Conversation } from '../schemas/conversation.schema';
import { MessageRepository } from '../repositories/message.repository';
import { AddUserToConversationDto } from '../dtos/add-user-to-conversation.dto';

@Injectable()
export class ChatService {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly messageRepository: MessageRepository,
    private readonly userService: UserService,
  ) {}

  //#region Conversations Methods

  public async getAllConversation(userId: string): Promise<Conversation[]> {
    const allConversations = await this.conversationRepository.findAll({
      participants: {
        $in: userId,
      },
    });

    return allConversations;
  }


  public async getConversationById(
    conversationId: string,
  ): Promise<Conversation> {
    return await this.conversationRepository.findOne({ _id: conversationId });
  }

  
  public async updateLastMessage(
    message: Message,
    room: Conversation,
  ): Promise<Conversation> {
    try {
      return await this.conversationRepository.updateOne(
        {
          _id: room._id,
        },
        {
          $set: {
            last_message: {
              user_id: message.sender._id.toString(),
              message: {
                type: message.type,
                content: message.message,
                time: message.createdAt,
              },
            },
          },
        },
      );
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  public async createSingleConversation(
    senderId: string,
    partnerId: string,
  ): Promise<Conversation> {
    const sender = await this.userService.getUserById(senderId);
    const partner = await this.userService.getUserById(partnerId);
    const conversationsList = await this.getAllConversation(senderId);
    const existConversation = conversationsList.some((conversation) =>
      this.checkUserInConversation(partner, conversation),
    );

    if (existConversation)
      throw new BadRequestException('Bạn đã có cuộc trò chuyện với người này rồi');
    return await this.conversationRepository.create({
      chat_room_name: '',
      chat_room_image: '',
      last_message: null,
      participants: [sender,partner],
    });
  }

  public async addUserToConversation(
    userId: string,
    addUserToConversationDto: AddUserToConversationDto,
  ): Promise<Conversation> {
    const { partnerId, message } = addUserToConversationDto;
    const conversationAdded = await this.createSingleConversation(
      userId,
      partnerId,
    );
    const firstMessage = await this.messageRepository.create({
      chat_room: conversationAdded,
      message: message,
      type: MessageType.TEXT,
      seen: [conversationAdded.participants[0]],
      sender:  conversationAdded.participants[0]
    });

    return await this.updateLastMessage(firstMessage, conversationAdded);
  }

  // public async removeAllConversations(): Promise<boolean> {
  //   return await this.conversationRepository.deleteMany();
  // }
  //#endregion

  //#region Message Methods

  private checkUserInConversation(
    sender: User,
    conversation: Conversation,
  ): boolean {
    if (!conversation)
      throw new BadRequestException('Cuộc trò chuyện không tồn tại');

    return conversation.participants.some((participant) => {
      // console.log(participant._id.toString() === sender._id.toString());
      return participant._id.toString() === sender._id.toString();
    });
  }

  public async getAllMessages(
    userId: string,
    conversationId: string | undefined,
  ): Promise<Message[]> {
    if (conversationId === 'null')
      throw new BadRequestException('Mở một cuộc trò chuyện để bắt đầu');
    const sender = await this.userService.getUserById(userId);
    const conversation = await this.getConversationById(conversationId);
    const isInConversation = await this.checkUserInConversation(
      sender,
      conversation,
    );

    if (!isInConversation)
      throw new ForbiddenException(
        'Bạn không thể truy cập cuộc trò chuyện này',
      );

    return await this.messageRepository.findAll({
      chat_room: {
        _id: conversation._id,
      },
    });
  }

  public async sendMessage(
    userId: string,
    { chat_room, type = MessageType.TEXT, message }: CreateMessageDto,
  ): Promise<Message> {
    const sender = await this.userService.getUserById(userId);
    const conversation = await this.getConversationById(chat_room);
    const isInRoom = this.checkUserInConversation(sender, conversation);
    if (!isInRoom)
      throw new ForbiddenException(
        'Bạn không thể truy cập cuộc trò chuyện này',
      );
    const messageOptionDto: Message = {
      sender,
      ...{
        chat_room: conversation,
        type,
        seen: [sender],
        message,
      },
    };
    const newMessage = await this.messageRepository.create(messageOptionDto);
    await this.updateLastMessage(newMessage, newMessage.chat_room);
    return newMessage;
  }

  public async seenMessage(userId: string, messageId: string): Promise<Message> {
    const message: Message = await this.messageRepository.findOne({
      _id: messageId,
    });

    if (!message) throw new BadRequestException('Tin nhắn không tồn tại');
    const user: User = await this.userService.getUserById(userId);
    const isInRoom = this.checkUserInConversation(user, message.chat_room);

    if (!isInRoom)
      throw new ForbiddenException('Bạn không ở trong cuộc trò chuyện');
    return await this.messageRepository.updateOne(
      {
        _id: message._id,
        seen: {
          $ne: user._id,
        },
      },
      { $push: { seen: user } },
    );
  }

  // public async removeAllMessages(): Promise<boolean> {
  //   return await this.messageRepository.deleteMany();
  // }
  //#endregion
}
