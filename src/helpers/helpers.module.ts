import { ChatModule } from '@/chat/chat.module';
import { UserModule } from '@/user/user.module';
import { Module } from '@nestjs/common';
import { FileController } from './controllers/file.controller';

@Module({
    imports: [
        ChatModule,
        UserModule
    ],
    controllers: [FileController],
    providers: [],
})
export class HelpersModule {};