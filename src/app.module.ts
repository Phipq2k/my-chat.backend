import { Module } from '@nestjs/common';
import { APP_FILTER} from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@auth/auth.module';
import { DatabaseModule } from '@database/database.module';
import { LoggerModule } from './common/logger/logger.module';
import { UserModule } from './user/user.module';
import { AllExceptionFilter } from './common/filters';
import { ChatModule } from './chat/chat.module';
import { EmailModule } from './email/email.module';
import { HelpersModule } from './helpers/helpers.module';
import { HomeGateway } from './socket-server/gateways/home.gateway';

@Module({
  imports: [
    DatabaseModule,
    LoggerModule,
    UserModule,
    AuthModule,
    ChatModule,
    EmailModule,
    HelpersModule,
    // SearchModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter
    },
    HomeGateway,
    AppService
  ],  
})
export class AppModule {}
