import AdminBro, { Router } from 'admin-bro';
import { Controller, All, Inject, Request, Response } from '@nestjs/common';

import { ADMIN_BRO_TOKEN } from './token.constants';

@Controller('admin')
export class AdminController {
  constructor(@Inject(ADMIN_BRO_TOKEN) private readonly adminBroInstance: AdminBro) {}

  @All('*')
  public requestHandler(@Request() req) {
    const { routes } = Router;
    console.log(req);
    // routes.map()
    return 'test';
  }
}
