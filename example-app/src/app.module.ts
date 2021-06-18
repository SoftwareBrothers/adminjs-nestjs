import { Module } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import AdminJS from 'adminjs';
import AdminJSMongoose from '@adminjs/mongoose';
import { Model } from 'mongoose';

import { AdminModule } from '../../src'; // lib

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExpressCustomLoader } from './express-custom.loader';
import { Admin } from './mongoose/admin-model';
import { MongooseSchemasModule } from './mongoose/mongoose.module';

AdminJS.registerAdapter(AdminJSMongoose);

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nest'),
    AdminModule.createAdminAsync({
      imports: [
        MongooseSchemasModule,
      ],
      inject: [
        getModelToken('Admin'),
      ],
      useFactory: (adminModel: Model<Admin>) => ({
        adminJsOptions: {
          rootPath: '/admin',
          resources: [
            { resource: adminModel },
          ],
        },
        auth: {
          authenticate: async (email, password) => Promise.resolve({ email: 'test' }),
          cookieName: 'test',
          cookiePassword: 'testPass',
        },
      }),
      customLoader: ExpressCustomLoader,
    }),
    MongooseSchemasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
