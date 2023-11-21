/* eslint-disable no-underscore-dangle */
import { Injectable } from '@nestjs/common';
import { loadPackage } from '@nestjs/common/utils/load-package.util.js';
import { AbstractHttpAdapter } from '@nestjs/core';
import type AdminJS from 'adminjs';

import { AdminModuleOptions } from '../interfaces/admin-module-options.interface.js';

import { AbstractLoader } from './abstract.loader.js';

@Injectable()
export class ExpressLoader extends AbstractLoader {
  public async register(
    admin: AdminJS,
    httpAdapter: AbstractHttpAdapter,
    options: AdminModuleOptions,
  ) {
    const app = httpAdapter.getInstance();

    loadPackage('express', '@adminjs/nestjs');
    const adminJsExpressjs = await import('@adminjs/express');
    loadPackage('express-formidable', '@adminjs/nestjs');

    let router;

    if (options.auth) {
      loadPackage('express-session', '@adminjs/nestjs');
      router = adminJsExpressjs.default.buildAuthenticatedRouter(
        admin,
        options.auth,
        undefined,
        options.sessionOptions as any,
        options.formidableOptions,
      );
    } else {
      router = adminJsExpressjs.default.buildRouter(
        admin,
        undefined,
        options.formidableOptions,
      );
    }

    // This named function is there on purpose.
    // It names layer in main router with the name of the function, which helps localize
    // admin layer in reorderRoutes() step.
    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    app.use(options.adminJsOptions.rootPath, function admin(req, res, next) {
      return router(req, res, next);
    });
    this.reorderRoutes(app);
  }

  private reorderRoutes(app) {
    let jsonParser = [];
    let urlencodedParser = [];
    let admin = [];

    // Nestjs uses bodyParser under the hood which is in conflict with adminjs setup.
    // Due to adminjs-expressjs usage of formidable we have to move body parser in layer tree after adminjs init.
    // Notice! This is not documented feature of express, so this may change in the future. We have to keep an eye on it.
    if (app && app._router && app._router.stack) {
      const jsonParserIndex = app._router.stack.findIndex(
        (layer: { name: string }) => layer.name === 'jsonParser',
      );
      if (jsonParserIndex >= 0) {
        jsonParser = app._router.stack.splice(jsonParserIndex, 1);
      }

      const urlencodedParserIndex = app._router.stack.findIndex(
        (layer: { name: string }) => layer.name === 'urlencodedParser',
      );
      if (urlencodedParserIndex >= 0) {
        urlencodedParser = app._router.stack.splice(urlencodedParserIndex, 1);
      }

      const adminIndex = app._router.stack.findIndex(
        (layer: { name: string }) => layer.name === 'admin',
      );
      if (adminIndex >= 0) {
        admin = app._router.stack.splice(adminIndex, 1);
      }

      // if adminjs-nestjs didn't reorder the middleware
      // the body parser would have come after corsMiddleware
      const corsIndex = app._router.stack.findIndex(
        (layer: { name: string }) => layer.name === 'corsMiddleware',
      );

      // in other case if there is no corsIndex we go after expressInit, because right after that
      // there are nest endpoints.
      const expressInitIndex = app._router.stack.findIndex(
        (layer: { name: string }) => layer.name === 'expressInit',
      );

      const initIndex = (corsIndex >= 0 ? corsIndex : expressInitIndex) + 1;

      app._router.stack.splice(
        initIndex,
        0,
        ...admin,
        ...jsonParser,
        ...urlencodedParser,
      );
    }
  }
}
