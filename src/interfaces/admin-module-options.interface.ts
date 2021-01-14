import { AdminBroOptions, CurrentAdmin } from 'admin-bro';
import { SessionOptions } from 'express-session';

import { ExpressFormidableOptions } from './express-formidable-options.interface';

/**
 * Options passed to nestjs module
 * 
 * @memberof module:@admin-bro/nestjs
 * @alias AdminModuleOptions
 */
export type AdminModuleOptions = {
  /**
   * Standard AdminBro options
   */
  adminBroOptions: AdminBroOptions,
  /**
   * Authentication options. When NOT provided, it will initialize AdminBro without login page and authorization function. 
   */
  auth?: {
    /**
     * verifies if given credentials are valid, therefore if user has access to Admin Panel
     */
    authenticate: (email: string, password: string) => Promise<CurrentAdmin>,
    cookiePassword: string,
    cookieName: string,
  }
  /**
   * Options passed to express formidable (used only by AdminBro express module)
   */
  formidableOptions?: ExpressFormidableOptions,
  /**
   * Options passed to express session (used only by AdminBro express module)
   * Here you might want to change the store from the default memory store to
   * something more reliable (i.e. database).
   */
  sessionOptions?: SessionOptions,
  /**
   * Flag indicating if admin-bro should be initialized. Helpful in cases like turning off admin for tests.
   * Default is true.
   */
  shouldBeInitialized?: boolean,
}
