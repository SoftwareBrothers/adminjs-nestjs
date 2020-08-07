import AdminBro, { Router, AdminBroOptions } from 'admin-bro'
import { Module, NestModule, MiddlewareConsumer, DynamicModule } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'

import { AdminController } from './admin.controller'
import { ADMIN_BRO_TOKEN } from './token.constants'

@Module({})
export class AdminModule {
  public static createAdminModule(config: AdminBroOptions = {}): DynamicModule {
    console.log(Router.assets);

    return {
      module: AdminModule,
      controllers: [AdminController],
      providers: [
        {
          provide: ADMIN_BRO_TOKEN,
          useFactory: async () => {
            const admin = new AdminBro(config);
            await admin.initialize();

            return admin;
          },
        },
      ],
      imports: [
        ServeStaticModule.forRootAsync({
          useFactory: () => Router.assets.map((asset) => ({
            rootPath: asset.src,
            renderPath: `${asset.path}`,
          })),
        }),
      ],
    }
  }
}
