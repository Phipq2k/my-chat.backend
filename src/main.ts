import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SanitizeMongooseModelInterceptor } from 'nestjs-mongoose-exclude';
import { AppModule } from './app.module';
import { AccessTokenGuard } from './common/guards';
import { ConfigCustomService } from './config/config.service';
import { SocketIoAdapter } from './socket-server/socket-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigCustomService);
  const clientPort = config.get<number>('CLIENT_PORT');
  const socketServer = new SocketIoAdapter(app, config);

  const appPort = config.getPortConfig();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(
    new SanitizeMongooseModelInterceptor({
      excludeMongooseId: false,
      excludeMongooseV: true,
    }),
  );
  app.enableCors({
    origin: [
      `http://localhost:${clientPort}`,
      new RegExp(`/http:\/\/192\.168\.1\.([1-9][1-9]\d):${clientPort}`),
    ],
  });
  app.useWebSocketAdapter(socketServer);
  //Swagger Api
  const configSwagger = new DocumentBuilder()
    .setTitle('MyChat API Documentation')
    .setDescription('')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api', app, document);
  await app.listen(appPort, () => console.log('Listening on port ' + appPort));
}
bootstrap();
