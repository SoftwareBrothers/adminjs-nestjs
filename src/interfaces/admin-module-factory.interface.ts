/* eslint-disable @typescript-eslint/no-explicit-any */
import { ModuleMetadata } from '@nestjs/common';

import { AdminModuleOptions } from './admin-module-options.interface.js';

export interface AdminModuleFactory extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[],
  useFactory: (...args: any[]) => Promise<AdminModuleOptions> | AdminModuleOptions,
}
