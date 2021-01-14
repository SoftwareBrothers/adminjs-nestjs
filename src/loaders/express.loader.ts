/* eslint-disable no-underscore-dangle */
import AdminBro from 'admin-bro';
import { Injectable } from '@nestjs/common';
import { AbstractHttpAdapter } from '@nestjs/core';
import { loadPackage } from '@nestjs/common/utils/load-package.util';

import { AdminModuleOptions } from '../interfaces/admin-module-options.interface';

import { AbstractLoader } from './abstract.loader';

@Injectable()
export class ExpressLoader extends AbstractLoader {
  public register(
    admin: AdminBro,
    httpAdapter: AbstractHttpAdapter,
    options: AdminModuleOptions,
  ) {
    const app = httpAdapter.getInstance();

    loadPackage('express', '@admin-bro/nestjs');
    const adminBroExpressjs = loadPackage('@admin-bro/express', '@admin-bro/nestjs', () =>
      require('@admin-bro/express')
    );
    loadPackage('express-formidable', '@admin-bro/nestjs');

    let router;

    if ('auth' in options) {
      loadPackage('express-session', '@admin-bro/nestjs');
      router = adminBroExpressjs.buildAuthenticatedRouter(
        admin, options.auth, undefined, options.sessionOptions, options.formidableOptions
      );
    } else {
      router = adminBroExpressjs.buildRouter(admin, undefined, options.formidableOptions);
    }

    // This named function is there on purpose. 
    // It names layer in main router with the name of the function, which helps localize
    // admin layer in reorderRoutes() step.
    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    app.use(options.adminBroOptions.rootPath, function admin(req, res, next) {
      return router(req, res, next);
    });
    this.reorderRoutes(app);
  }

  private reorderRoutes(app) {
    let jsonParser;
    let urlencodedParser;
    let admin;

    // Nestjs uses bodyParser under the hood which is in conflict with admin-bro setup.
    // Due to admin-bro-expressjs usage of formidable we have to move body parser in layer tree after admin-bro init.
    // Notice! This is not documented feature of express, so this may change in the future. We have to keep an eye on it.
    if (app && app._router && app._router.stack) {
      const jsonParserIndex = app._router.stack.findIndex(
        (layer: { name: string }) => layer.name === 'jsonParser'
      );
      if (jsonParserIndex >= 0) {
        jsonParser = app._router.stack.splice(jsonParserIndex, 1);
      }

      const urlencodedParserIndex = app._router.stack.findIndex(
        (layer: { name: string }) => layer.name === 'urlencodedParser'
      );
      if (urlencodedParserIndex >= 0) {
        urlencodedParser = app._router.stack.splice(urlencodedParserIndex, 1);
      }

      const adminIndex = app._router.stack.findIndex(
        (layer: { name: string }) => layer.name === 'admin'
      );
      if (adminIndex >= 0) {
        admin = app._router.stack.splice(adminIndex, 1)
      }

      // if admin-bro-nestjs didn't reorder the middleware
      // the body parser would have come after corsMiddleware
      const corsIndex = app._router.stack.findIndex(
        (layer: { name: string }) => layer.name === 'corsMiddleware',
      )

      // in other case if there is no corsIndex we go after expressInit, because right after that
      // there are nest endpoints.
      const expressInitIndex = app._router.stack.findIndex(
        (layer: { name: string }) => layer.name === 'expressInit',
      )

      const initIndex = (corsIndex >= 0 ? corsIndex : expressInitIndex) + 1;

      app._router.stack.splice(
        initIndex,
        0,
        ...admin,
        ...jsonParser,
        ...urlencodedParser,
      )
    }
  }
}
