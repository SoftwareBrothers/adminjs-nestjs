import type { AdminJSOptions, BaseAuthProvider, CurrentAdmin } from 'adminjs';
import { SessionOptions } from 'express-session';

import { ExpressFormidableOptions } from './express-formidable-options.interface.js';

/**
 * Options passed to nestjs module
 *
 * @memberof module:@adminjs/nestjs
 * @alias AdminModuleOptions
 */
export type AdminModuleOptions = {
  /**
   * Standard AdminJS options
   */
  adminJsOptions: AdminJSOptions,
  /**
   * Authentication options. When NOT provided, it will initialize AdminJS without login page and authorization function.
   */
  auth?: {
    /**
     * verifies if given credentials are valid, therefore if user has access to Admin Panel
     */
    authenticate?: (email: string, password: string, ctx?: any) => Promise<CurrentAdmin | null>,
    cookiePassword: string,
    cookieName: string,
    provider?: BaseAuthProvider,
  }
  /**
   * Options passed to express formidable (used only by AdminJS express module)
   */
  formidableOptions?: ExpressFormidableOptions,
  /**
   * Options passed to express session (used only by AdminJS express module)
   * Here you might want to change the store from the default memory store to
   * something more reliable (i.e. database).
   */
  sessionOptions?: SessionOptions,
  /**
   * Flag indicating if adminjs should be initialized. Helpful in cases like turning off admin for tests.
   * Default is true.
   */
  shouldBeInitialized?: boolean,
}
