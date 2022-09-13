import { ChatService } from '@/chat/services/chat.service';
import {
  NewConversation,
  NewMessage,
} from '@/common/types/chat.type';
import { UserService } from '@/user/user.service';
import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class HomeGateway
  implements OnGatewayConnection<Socket>, OnGatewayDisconnect<Socket>
{
  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UserService,
  ) {}

  @WebSocketServer()
  private server: Server;
  private readonly logger = new Logger(HomeGateway.name);

  public async handleConnection(client: Socket, ...args: any[]) {
    try {
      const userId = client.handshake.headers['authorization'];
      this.logger.log(`${userId} connected`);
      await this.userService.updateUser(
        { _id: userId },
        { socketId: client.id },
      );
      const allRoomsOfUser = await this.chatService.getAllConversation(userId);
      allRoomsOfUser.map((room) => {
        client.join(room._id.toString());
      });
    } catch (err) {
      this.logger.error(err.message);
      this.server.disconnectSockets(true);
    }
  }

  public async handleDisconnect(client: Socket) {
    try {
      const userId = client.handshake.headers['authorization'];
      this.logger.log(`${userId} disconnect`);
      // console.log(userId);
      await this.userService.updateUser(
        {
          _id: userId,
          socketId: {
            $ne: null,
          },
        },
        { socketId: null },
      );
    } catch (err) {
      this.logger.error(err.message);
    }
  }

  @SubscribeMessage('onSendMessage')
  public async sendMessage(client: Socket, message: NewMessage) {
    this.server
      .to(message.chat_room)
      .emit('emitSendMessage', message.content);
  }

  @SubscribeMessage('onAddUserToConversation')
  public async handleAddUserToConversation(
    client: Socket,
    newConversation: NewConversation,
  ) {
    const { partnerId, conversationId } = newConversation;
    const { socketId } = await this.userService.getUserById(partnerId);
    if (socketId) {
      this.server
        .to(socketId)
        .emit('emitAddUserToConversation', conversationId);
    }
    this.server.to(client.id).emit('emitAddUserToConversation', conversationId);
  }

  @SubscribeMessage('onSeenMessage')
  public async handleSeen(client: Socket, conversationId: string) {
    const userId = client.handshake.headers['authorization'];
    const allMessages = await this.chatService.getAllMessages(
      userId,
      conversationId,
    );
    allMessages.map(async (message) => {
      await this.chatService.seenMessage(userId, message._id.toString());
    });

    this.server
      .to(conversationId)
      .emit('emitSeenMessage', allMessages[allMessages.length - 1]?.seen);
  }
}
