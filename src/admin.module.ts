import AdminBro from 'admin-bro'
import { Module, DynamicModule, OnModuleInit, Inject } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'

import { serveStaticProvider } from './serve-static.provider'
import { CONFIG_TOKEN } from './token.constants'
import { AbstractLoader } from './loaders/abstract.loader'
import { AdminModuleOptions } from './interfaces/admin-module-options.interface'
import { AdminModuleFactory } from './interfaces/admin-module-factory.interface'
import { CustomLoader } from './interfaces/custom-loader.interface'

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
@Module({})
export class AdminModule implements OnModuleInit {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly loader: AbstractLoader,
    @Inject(CONFIG_TOKEN)
    private readonly adminModuleOptions: AdminModuleOptions,
  ) {}

  /**
   * Creates admin in a synchronous way
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
  public static createAdmin(options: AdminModuleOptions & CustomLoader): DynamicModule {
    return {
      module: AdminModule,
      providers: [
        {
          provide: CONFIG_TOKEN,
          useValue: options,
        },
        options.customLoader ? {
          provide: AbstractLoader,
          useClass: options.customLoader,
        } : serveStaticProvider,
      ],
    }
  }
  
  /**
   * Creates admin in an asynchronous way
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
  public static createAdminAsync(options: AdminModuleFactory & CustomLoader): DynamicModule {
    return {
      imports: options.imports,
      module: AdminModule,
      providers: [
        {
          provide: CONFIG_TOKEN,
          useFactory: options.useFactory,
          inject: options.inject,
        },
        options.customLoader ? {
          provide: AbstractLoader,
          useClass: options.customLoader,
        } : serveStaticProvider,
      ],
    }
  }

  /**
   * Applies given options to AdminBro and initializes it
   */
  public onModuleInit() {
    if ('shouldBeInitialized' in this.adminModuleOptions && !this.adminModuleOptions.shouldBeInitialized) {
      return;
    }

    const admin = new AdminBro(this.adminModuleOptions.adminBroOptions);

    const { httpAdapter } = this.httpAdapterHost;
    this.loader.register(admin, httpAdapter, { 
      ...this.adminModuleOptions, 
      adminBroOptions: admin.options,
    });
  }
}
