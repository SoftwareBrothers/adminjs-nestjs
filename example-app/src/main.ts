import AdminBro from 'admin-bro';
import AdminBroMongoose from '@admin-bro/mongoose';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

AdminBro.registerAdapter(AdminBroMongoose);

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }))
  await app.listen(3000);
}
bootstrap();
