/**
 * @module:@admin-bro/nestjs
 * 
 * @description
 * This is an official plugin which allows you to render AdminBro in [NestJS
 * framework](https://nestjs.com/)
 * 
 * ## Installation
 * 
 * 1. First of all, install the AdminBro along with the module:
 * 
 * ```
 * yarn add admin-bro @admin-bro/nestjs
 * ```
 * 
 * 2. Once the installation process is complete, we can import the AdminBroModule
 * into the root AppModule.
 * 
 * ```
 * 
 * 
 * 
 * import { Module } from '@nestjs/common';
 * import { AdminModule } from '@admin-bro/nestjs';
 * 
 * @Module({
 *   imports: [
 *     AdminModule.createAdminModule({
 *       // module options
 *     }),
 *   ],
 * })
 * export class AppModule {}
 * ```
 */

import * as NestJSPlugin from './admin.module'

export * from './admin.module';
export default NestJSPlugin
