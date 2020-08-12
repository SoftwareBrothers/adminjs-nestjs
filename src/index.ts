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
 * yarn add admin-bro @admin-bro/nestjs @admin-bro/express
 * ```
 * 
 * 2. Once the installation process is complete, we can import the AdminBroModule
 * into the root AppModule.
 * 
 * ```
 * import { Module } from '@nestjs/common';
 * import { AdminModule } from '@admin-bro/nestjs';
 * 
 * @Module({
 *   imports: [
 *     AdminModule.createAdminModule({
 *      useFactory: () => ({
 *        adminBroOptions: {
 *          rootPath: '/admin',
 *          resources: [],
 *        },
 *      }),
 *    }),
 *   ],
 * })
 * export class AppModule {}
 * ```
 * 
 * Then enter `/admin` path in your browser and you should see the AdminBro.
 * 
 * 3. Passing resources
 * 
 * Let say you use @nestjs/typeorm module, and you have users module.
 * 
 * - you have to install @admin-bro/typeorm adapter
 * - you have to register it in AdminBro (as stated in the docs)
 * - and you have to pass it to your options
 * 
 * ```
 * import AdminBro from 'admin-bro';
 * import { Module } from '@nestjs/common';
 * import { AdminModule } from '@admin-bro/nestjs';
 * import { Database, Resource } from '@admin-bro/typeorm'
 * import { TypeOrmModule } from '@nestjs/typeorm';
 * import { UsersModule } from './users/users.module';
 * 
 * AdminBro.registerAdapter({ Database, Resource })
 * 
 * @Module({
 *   imports: [
 *     // you will have to change connection data of course :)
 *     TypeOrmModule.forRoot({
 *       type: 'postgres',
 *       host: 'localhost',
 *       port: 5432,
 *       username: 'postgres',
 *       password: '',
 *       database: 'database_test',
 *       entities: [User],
 *       synchronize: true,
 *     }),
 *     AdminModule.createAdminModule({
 *      useFactory: () => ({
 *        adminBroOptions: {
 *          rootPath: '/admin',
 *          resources: [User],
 *        },
 *      }),
 *    }),
 *   ],
 * })
 * export class AppModule {}
 * ```
 * 
 * ## Authentication
 * 
 * Apart from the `adminBroOptions` useFactory can return `auth` settings.
 * 
 * This is an example which always logs users in, since authenticate method
 * always returns a Promise resolving to {@link CurrentAdmin}. You may
 * want to compare the password against what what you have encrypted
 * in the database.
 * 
 * ```
 * AdminModule.createAdminModule({
 *   useFactory: () => ({
 *     adminBroOptions: {
 *       rootPath: '/admin',
 *       resources: [User],
 *     },
 *     auth: {
 *       authenticate: async (email, password) => Promise.resolve({ email: 'test' }),
 *       cookieName: 'test',
 *       cookiePassword: 'testPass',
 *     },
 *   }),
 * ```
 * 
 */

import * as NestJSPlugin from './admin.module'

export * from './admin.module';
export default NestJSPlugin
