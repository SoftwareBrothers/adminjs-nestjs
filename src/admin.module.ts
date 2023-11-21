import { DynamicModule, Inject, Module, OnModuleInit } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'

import AdminResourceService from './admin-resource.service.js'
import { AdminModuleFactory } from './interfaces/admin-module-factory.interface.js'
import { AdminModuleOptions } from './interfaces/admin-module-options.interface.js'
import { CustomLoader } from './interfaces/custom-loader.interface.js'
import { AbstractLoader } from './loaders/abstract.loader.js'
import { serveStaticProvider } from './serve-static.provider.js'
import { CONFIG_TOKEN } from './token.constants.js'

/**
 * Nest module which is responsible for an AdminJS integration
 * 
 * @summary Nest Module
 * 
 * @class
 * @name module:@adminjs/nestjs~AdminModule
 * @alias AdminModule
 * @memberof module:@adminjs/nestjs
 */
// This is needed by JSDoc which cannot parse this statement
@Module({})
export class AdminModule implements OnModuleInit {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly loader: AbstractLoader,
    @Inject(CONFIG_TOKEN)
    private readonly adminModuleOptions: AdminModuleOptions,
  ) { }

  /**
   * Creates admin in a synchronous way
   * 
   * @param {AdminModuleOptions} options
   * @memberof module:@adminjs/nestjs~AdminModule
   * @method
   * @name createAdmin
   * @example
   * import { Module } from '@nestjs/common';
   * import { AdminModule } from '@adminjs/nestjs';
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
   * @memberof module:@adminjs/nestjs~AdminModule
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
   *         adminJsOptions: {
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
   * Applies given options to AdminJS and initializes it
   */
  public async onModuleInit() {
    if ('shouldBeInitialized' in this.adminModuleOptions && !this.adminModuleOptions.shouldBeInitialized) {
      return;
    }

    const { default: AdminJS } = await import('adminjs');

    const forFeatureResources = AdminResourceService.getResources()

    const adminJSOptions = forFeatureResources.length > 0
      ? { ...this.adminModuleOptions.adminJsOptions, resources: forFeatureResources }
      : this.adminModuleOptions.adminJsOptions

    const admin = new AdminJS(adminJSOptions);
    admin.watch();

    const { httpAdapter } = this.httpAdapterHost;
    this.loader.register(admin, httpAdapter, {
      ...this.adminModuleOptions,
      adminJsOptions: admin.options,
    });
  }
}
