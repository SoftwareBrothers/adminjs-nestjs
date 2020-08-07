import { Module } from '@nestjs/common';

import { AdminModule } from '../../src/index';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [AdminModule.createAdminModule({
    adminBroOptions: {
      rootPath: '/admin',
    },
    // auth: {
    //   authenticate: async () => new Promise(() => ({ email: 'mordeczka' })),
    //   cookieName: 'test',
    //   cookiePassword: 'testPass',
    // },
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
