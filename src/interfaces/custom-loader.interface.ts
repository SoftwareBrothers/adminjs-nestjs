import { Type } from '@nestjs/common';

import { AbstractLoader } from '../loaders/abstract.loader.js';

export type CustomLoader = {
  /**
   * In order not to use default Express (@adminjs/express) or Fastify (not yet implemented) loader
   * you can provide your own implementation of Loader that plugs in AdminJS.
   */
  customLoader?: Type<AbstractLoader>;
};
