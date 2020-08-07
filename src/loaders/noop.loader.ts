/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import AdminBro from 'admin-bro';
import { Injectable } from '@nestjs/common';
import { AbstractHttpAdapter } from '@nestjs/core';

import { AdminModuleOptions } from '../interfaces/admin-module-options.interface';

import { AbstractLoader } from './abstract.loader';

@Injectable()
export class NoopLoader extends AbstractLoader {
  public register(
    admin: AdminBro,
    httpAdapter: AbstractHttpAdapter,
    options: AdminModuleOptions,
  ) {}
}
