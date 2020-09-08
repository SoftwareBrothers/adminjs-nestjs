import AdminBro from 'admin-bro'
import { Module, DynamicModule, OnModuleInit, Inject } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'

import { serveStaticProvider } from './serve-static.provider'
import { CONFIG_TOKEN } from './token.constants'
import { AbstractLoader } from './loaders/abstract.loader'
import { AdminModuleOptions } from './interfaces/admin-module-options.interface'
import { AdminModuleFactory } from './interfaces/admin-module-factory.interface'

/**
 * Nest module which is responsible for an AdminBro integration
 * 
 * @summary Nest Module
 * 
 * @class
 * @name module:@admin-bro/nestjs~AdminModule
 * @alias AdminModule
 * @memberof module:@admin-bro/nestjs
 */
// This is needed by JSDoc which cannot parse this statement
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

  /**
   * Creates admin in an synchronous way
   * 
   * @param {AdminModuleOptions} options
   * @memberof module:@admin-bro/nestjs~AdminModule
   * @method
   * @name createAdmin
   * @example
   * import { Module } from '@nestjs/common';
   * import { AdminModule } from '@admin-bro/nestjs';
   * 
   * \@Module({
   *   imports: [
   *     AdminModule.createAdmin({
   *        rootPath: '/admin',
   *        resources: [],
   *     }),
   *   ],
   * })
   * export class AppModule {}
   * 
   */
  // This is needed by JSDoc which cannot parse this statement
  public static createAdmin(options: AdminModuleOptions): DynamicModule {
    return {
      module: AdminModule,
      providers: [
        {
          provide: CONFIG_TOKEN,
          useValue: options,
        },
      ],
    }
  }
  
  /**
   * Creates admin in a synchronous way
   * 
   * @param {AdminModuleFactory} options
   * @memberof module:@admin-bro/nestjs~AdminModule
   * @method
   * @name createAdminAsync
   * @example
   * \@Module({
   *   imports: [
   *     MongooseModule.forRoot('mongodb://localhost:27017/test'),
   *     AdminModule.createAdminAsync({
   *       imports: [
   *         MongooseSchemasModule, // importing module that exported model we want to inject
   *       ],
   *       inject: [
   *         getModelToken('Admin'), // using mongoose function to inject dependency
   *       ],
   *       useFactory: (adminModel: Model<Admin>) => ({ // injected dependecy will appear as an argument
   *         adminBroOptions: {
   *           rootPath: '/admin',
   *           resources: [
   *             { resource: adminModel },
   *           ],
   *         },
   *       }),
   *     }),
   *     MongooseSchemasModule,
   *     ],
   *  })
   *  export class AppModule { }
   */
  public static createAdminAsync(options: AdminModuleFactory): DynamicModule {
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

  /**
   * Initiates the module
   */
  public onModuleInit() {
    const admin = new AdminBro(this.adminModuleOptions.adminBroOptions);

    const { httpAdapter } = this.httpAdapterHost;
    this.loader.register(admin, httpAdapter, { 
      ...this.adminModuleOptions, 
      adminBroOptions: admin.options,
    });
  }
}
