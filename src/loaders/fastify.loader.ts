import AdminBro from 'admin-bro';
import { Injectable } from '@nestjs/common';
import { loadPackage } from '@nestjs/common/utils/load-package.util';
import { AbstractHttpAdapter } from '@nestjs/core';

import { AdminModuleOptions } from '../interfaces/admin-module-options.interface';

import { AbstractLoader } from './abstract.loader';

@Injectable()
export class FastifyLoader extends AbstractLoader {
  public register(
    admin: AdminBro,
    httpAdapter: AbstractHttpAdapter,
    options: AdminModuleOptions,
  ) {
    const app = httpAdapter.getInstance();
    const fastifyStatic = loadPackage(
      'fastify-static',
      'ServeStaticModule',
      () => require('fastify-static')
    );
  }
}
