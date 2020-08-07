import AdminBro from 'admin-bro';
import { Injectable } from '@nestjs/common';
import { AbstractHttpAdapter } from '@nestjs/core';

import { AdminModuleOptions } from '../interfaces/admin-module-options.interface';

@Injectable()
export abstract class AbstractLoader {
  public abstract register(
    admin: AdminBro,
    httpAdapter: AbstractHttpAdapter,
    options: AdminModuleOptions,

  );
}
