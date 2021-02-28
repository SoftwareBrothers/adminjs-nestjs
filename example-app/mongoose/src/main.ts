import AdminBro from 'admin-bro';
import AdminBroMongoose from '@admin-bro/mongoose';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

AdminBro.registerAdapter(AdminBroMongoose);

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
