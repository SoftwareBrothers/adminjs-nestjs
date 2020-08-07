import { Provider } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { AbstractLoader } from './loaders/abstract.loader';
import { ExpressLoader } from './loaders/express.loader';
import { NoopLoader } from './loaders/noop.loader';

export const serveStaticProvider: Provider = {
  provide: AbstractLoader,
  useFactory: (httpAdapterHost: HttpAdapterHost) => {
    if (!httpAdapterHost || !httpAdapterHost.httpAdapter) {
      return new NoopLoader();
    }
    const httpAdapter = httpAdapterHost.httpAdapter;
    if (
      httpAdapter &&
        httpAdapter.constructor &&
        httpAdapter.constructor.name === 'FastifyAdapter'
    ) {
      // Not handled right now
      return new NoopLoader();
    }
    
    return new ExpressLoader();
  },
  inject: [HttpAdapterHost],
};
