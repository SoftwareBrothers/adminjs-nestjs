/* eslint-disable no-underscore-dangle */
import AdminJS from 'adminjs';
import { Injectable } from '@nestjs/common';
import { AbstractHttpAdapter } from '@nestjs/core';

import { AbstractLoader } from '../../src/loaders/abstract.loader';
import { AdminModuleOptions } from '../../src/interfaces/admin-module-options.interface';
import { ExpressLoader } from '../../src/loaders/express.loader';

@Injectable()
export class ExpressCustomLoader extends AbstractLoader {
  public register(
    admin: AdminJS,
    httpAdapter: AbstractHttpAdapter,
    options: AdminModuleOptions,
  ) {
    // eslint-disable-next-line no-console
    console.log('Custom loader')
    new ExpressLoader().register(admin, httpAdapter, options);
  }
}
