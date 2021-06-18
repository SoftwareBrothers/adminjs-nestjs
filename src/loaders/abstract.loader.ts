import AdminJS from 'adminjs';
import { Injectable } from '@nestjs/common';
import { AbstractHttpAdapter } from '@nestjs/core';

import { AdminModuleOptions } from '../interfaces/admin-module-options.interface';

@Injectable()
export abstract class AbstractLoader {
  public abstract register(
    admin: AdminJS,
    httpAdapter: AbstractHttpAdapter,
    options: AdminModuleOptions,

  );
}
