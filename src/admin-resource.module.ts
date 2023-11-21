import { DynamicModule, Module } from '@nestjs/common';
import { type ResourceWithOptions } from 'adminjs';

import AdminResourceService from './admin-resource.service.js';

/**
 * Nest module which is responsible for admin resources
 * 
 * @summary Nest Module
 * 
 * @class
 * @name module:@adminjs/nestjs~AdminResourceModule
 * @alias AdminResourceModule
 * @memberof module:@adminjs/nestjs
 */
@Module({})
export class AdminResourceModule {
  /** 
   * Register resources
   * 
   * @param {(ResourceWithOptions | any)[]} resources
   * @memberof module:@adminjs/nestjs~AdminResourceModule
   * @method
   * @name forFeature
   * @example
   * import { Module } from '@nestjs/common';
   * import { AdminResourceModule } from '@adminjs/nestjs';
   * import { User } from './user.entity';
   * 
   * \@Module({
   *   imports: [
   *     AdminResourceModule.forFeature([User]),
   *   ],
   * })
   * export class UserModule {}
   * 
   */
  public static forFeature(resources: (ResourceWithOptions | any)[]): DynamicModule {
    AdminResourceService.add(resources)

    return {
      module: AdminResourceModule,
    };
  }
}
