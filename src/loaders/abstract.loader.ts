import { Injectable } from '@nestjs/common';
import { AbstractHttpAdapter } from '@nestjs/core';
import type AdminJS from 'adminjs';

import { AdminModuleOptions } from '../interfaces/admin-module-options.interface.js';

@Injectable()
export abstract class AbstractLoader {
  public abstract register(
    admin: AdminJS,
    httpAdapter: AbstractHttpAdapter,
    options: AdminModuleOptions,
  );
}
