import { Type } from '@nestjs/common';

import { AbstractLoader } from '../loaders/abstract.loader';

export type CustomLoader = {
  /**
   * In order not to use default Express (@admin-bro/express) or Fastify (not yet implemented) loader
   * you can provide your own implementation of Loader that plugs in AdminBro.
   */
  customLoader?: Type<AbstractLoader>;
};
