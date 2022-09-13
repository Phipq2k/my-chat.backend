// import { ChatRoomRepository } from '@/chat/repositories/chat-room.repository';
// import { ChatRoom } from '@/chat/schemas/conversation.schema';
// import { Injectable } from '@nestjs/common';
// import {DataFactory, Seeder} from 'nestjs-seeder';

// @Injectable()
// export class ChatRoomSeeder implements Seeder {
//     constructor(
//         private readonly chatRoomRepository: ChatRoomRepository
//     ) {}

//     public seed(): Promise<any> {
//         const chatRoom = DataFactory.createForClass(ChatRoom).generate(12);
//         return this.chatRoomRepository.createMany(chatRoom);
//     }

//     public drop(): Promise<any> {
//         return this.chatRoomRepository.deleteMany();
//     }
    
// }