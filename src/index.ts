/**
 * @module @admin-bro/nestjs
 * @subcategory Plugins
 * @section modules
 * 
 * @classdesc
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
 * ### Express:
 * You have to additionally add admin-bro express plugin along with packages it's using, express and express formidable:
 * 
 * ```
 * yarn add express @admin-bro/express express-formidable
 * ```
 * 
 * If you are passing `authenticate` object you have to also add express-session:
 * 
 * ```
 * yarn add express-session
 * ```
 * 
 * ### Fastify:
 * Work in progress - currently not available
 * 
 * 2. Once the installation process is complete, we can import the AdminModule
 * into the root AppModule.
 * 
 * ```
 * import { Module } from '@nestjs/common';
 * import { AdminModule } from '@admin-bro/nestjs';
 * 
 * \@Module({
 *   imports: [
 *     AdminModule.createAdmin({
 *       adminBroOptions: {
 *         rootPath: '/admin',
 *         resources: [],
 *       }),
 *     },
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
 * \@Module({
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
 *     AdminModule.createAdmin({
 *       adminBroOptions: {
 *          rootPath: '/admin',
 *          resources: [User],
 *       }
 *     }),
 *   ],
 * })
 * export class AppModule {}
 * ```
 * 
 * ## Authentication
 * 
 * Apart from the `adminBroOptions` you can define `auth` settings.
 * 
 * This is an example which always logs users in, since authenticate method
 * always returns a Promise resolving to {@link CurrentAdmin}. You may
 * want to compare the password against what what you have encrypted
 * in the database.
 * 
 * ```
 * AdminModule.createAdmin({
 *     adminBroOptions: {
 *       rootPath: '/admin',
 *       resources: [User],
 *     },
 *     auth: {
 *       authenticate: async (email, password) => Promise.resolve({ email: 'test' }),
 *       cookieName: 'test',
 *       cookiePassword: 'testPass',
 *     },
 * }),
 * ```
 * ## Advanced techniques
 * Sometimes some thing couldn't be provided synchronously, that's why there is also asynchronous way of providing options.
 * 
 * Let's say you use @nestjs/mongoose module, which could define models in modules that fit the best contextually.
 * This creates a problem that we don't have model instance available yet when we are creating AdminModule synchronously.
 * 
 * We can take advantage of nestjs dependency injection using `AdminModule.createAdminAsync()`. 
 * This method alows us to import modules that have necessary dependencies and then inject them to admin bro config.
 * 
 * For example:
 * - we have MongooseSchemasModule which defines Admin model and exports it:
 * 
 * ```
 * \@Module({
 *  imports: [
 *    MongooseModule.forFeature([{ name: 'Admin', schema: AdminSchema }]),
 *  ],
 *  exports: [MongooseModule],
 * })
 * export class MongooseSchemasModule {} 
 * ```
 * - we want to use Admin model in admin-bro panel, to be displayed as the resource
 * ```
 * \@Module({
 *    imports: [
 *      MongooseModule.forRoot('mongodb://localhost:27017/test'),
 *      AdminModule.createAdminAsync({
 *        imports: [
 *          MongooseSchemasModule, // importing module that exported model we want to inject
 *        ],
 *        inject: [
 *          getModelToken('Admin'), // using mongoose function to inject dependency
 *        ],
 *        useFactory: (adminModel: Model<Admin>) => ({ // injected dependecy will appear as an argument
 *          adminBroOptions: {
 *            rootPath: '/admin',
 *            resources: [
 *              { resource: adminModel },
 *            ],
 *          },
 *        }),
 *      }),
 *      MongooseSchemasModule,
 *    ],
 * })
 * export class AppModule { }
 * ```
 * 
 * ## Custom loader
 * In most cases default plugins for admin-bro are enough for functionality we need, but in rare ocasions 
 * we want to customize routing, or achieve different logic after login and this cases can be achieved only
 * by providing own plugin implementation. Because @admin-bro/nestjs under the hood uses plugin for express (@admin-bro/express)
 * it would require basically copying whole nestjs plugin and express plugin to own project to put any changes.
 * Instead there is optional parameter to put your custom loader if you don't want to use official one for any reason.
 * Your custom loader must extend AbstractLoader.
 * 
 * ```
 * \@Injectable()
 * export class CustomLoader extends AbstractLoader {
 *   public register(
 *     admin: AdminBro,
 *     httpAdapter: AbstractHttpAdapter,
 *     options: AdminModuleOptions,
 *   ) {}
 * }
 * ```
 * 
 * And then in module:
 * 
 * ```
 * AdminModule.createAdmin({
 *     adminBroOptions: {
 *       //...
 *     },
 *     auth: {
 *       //...
 *     },
 *     customLoader: CustomLoader,
 * }),
 * ```
 * 
 * or if you using more advanced techniques:
 * 
 * ```
 * AdminModule.createAdmin({
 *     useFactory: () => {}
 *     customLoader: CustomLoader,
 * }), 
 * ```
 * 
 * ## Example
 * There is a working example [here](https://github.com/SoftwareBrothers/admin-bro-nestjs/tree/master/example-app)
 */
import * as NestJSPlugin from './admin.module'

export * from './admin.module';
export default NestJSPlugin;
export * from './interfaces/admin-module-factory.interface';
export * from './interfaces/admin-module-options.interface';
export * from './interfaces/custom-loader.interface';
export * from './loaders/abstract.loader';
