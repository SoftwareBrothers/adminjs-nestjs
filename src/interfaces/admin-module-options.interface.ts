import { AdminBroOptions } from 'admin-bro';
import { SessionOptions } from 'express-session';

import { ExpressFormidableOptions } from './express-formidable-options.interface';

export interface AdminModuleOptions {
  adminBroOptions: AdminBroOptions,
  auth?: {
    authenticate: Function,
    cookiePassword: string,
    cookieName: string,
  }
  formidableOptions?: ExpressFormidableOptions,
  sessionOptions?: SessionOptions,
}
