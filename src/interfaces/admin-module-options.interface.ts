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
   * Authentication options
   */
  auth?: {
    /**
     * Authenticate method
     */
    authenticate: (email: string, password: string) => Promise<CurrentAdmin>,
    cookiePassword: string,
    cookieName: string,
  }
  /**
   * Options passed to express formidable (used by AdminBro)
   */
  formidableOptions?: ExpressFormidableOptions,
  /**
   * Options passed to express session (used by AdminBro)
   * Here you might want to change the store from the default memory store to
   * something more reliable (i.e. database).
   */
  sessionOptions?: SessionOptions,
}
