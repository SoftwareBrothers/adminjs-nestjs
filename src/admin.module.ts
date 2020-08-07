import AdminBro, { AdminBroOptions } from 'admin-bro'
import { Module, DynamicModule, OnModuleInit, Inject } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'

import { serveStaticProvider } from './serve-static.provider'
import { ADMIN_BRO_TOKEN, CONFIG_TOKEN } from './token.constants'
import { AbstractLoader } from './loaders/abstract.loader'
import { AdminModuleOptions } from './interfaces/admin-module-options.interface'

@Module({
  providers: [serveStaticProvider],
})
export class AdminModule implements OnModuleInit {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly loader: AbstractLoader,
    @Inject(ADMIN_BRO_TOKEN)
    private readonly adminBroInstance: AdminBro,
    @Inject(CONFIG_TOKEN)
    private readonly adminModuleOptions: AdminModuleOptions,
  ) {}
  
  public static createAdminModule(adminModuleOptions: AdminModuleOptions): DynamicModule {
    return {
      module: AdminModule,
      providers: [
        {
          provide: ADMIN_BRO_TOKEN,
          useFactory: async () => {
            const admin = new AdminBro(adminModuleOptions.adminBroOptions);
            await admin.initialize();

            return admin;
          },
        },
        {
          provide: CONFIG_TOKEN,
          useFactory: () => adminModuleOptions,
        },
      ],
      exports: [
        ADMIN_BRO_TOKEN,
      ],
    }
  }

  public onModuleInit() {
    const { httpAdapter } = this.httpAdapterHost;
    this.loader.register(this.adminBroInstance, httpAdapter, { 
      ...this.adminModuleOptions, 
      adminBroOptions: this.adminBroInstance.options,
    });
  }
}
