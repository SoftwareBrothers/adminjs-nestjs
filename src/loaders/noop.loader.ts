/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@nestjs/common';
import { AbstractHttpAdapter } from '@nestjs/core';
import type AdminJS from 'adminjs';

import { AdminModuleOptions } from '../interfaces/admin-module-options.interface.js';

import { AbstractLoader } from './abstract.loader.js';

@Injectable()
export class NoopLoader extends AbstractLoader {
  public register(
    admin: AdminJS,
    httpAdapter: AbstractHttpAdapter,
    options: AdminModuleOptions,
  ) { }
}
