import AdminBro from 'admin-bro'
import { Module, DynamicModule, OnModuleInit, Inject } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'

import { serveStaticProvider } from './serve-static.provider'
import { CONFIG_TOKEN } from './token.constants'
import { AbstractLoader } from './loaders/abstract.loader'
import { AdminModuleOptions } from './interfaces/admin-module-options.interface'
import { AdminModuleFactory } from './interfaces/admin-module-factory.interface'

@Module({
  providers: [serveStaticProvider],
})
export class AdminModule implements OnModuleInit {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly loader: AbstractLoader,
    @Inject(CONFIG_TOKEN)
    private readonly adminModuleOptions: AdminModuleOptions,
  ) {}
  
  public static createAdminModule(options: AdminModuleFactory): DynamicModule {
    return {
      imports: options.imports,
      module: AdminModule,
      providers: [
        {
          provide: CONFIG_TOKEN,
          useFactory: options.useFactory,
          inject: options.inject,
        },
      ],
    }
  }

  public async onModuleInit() {
    const admin = new AdminBro(this.adminModuleOptions.adminBroOptions);
    await admin.initialize();

    const { httpAdapter } = this.httpAdapterHost;
    this.loader.register(admin, httpAdapter, { 
      ...this.adminModuleOptions, 
      adminBroOptions: admin.options,
    });
  }
}
