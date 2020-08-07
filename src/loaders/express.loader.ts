import path from 'path';

import express from 'express';
import formidable from 'express-formidable';
import AdminBro, { Router } from 'admin-bro';
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

    const router = express.Router();

    router.use(formidable(options.formidableOptions));

    const { assets, routes } = Router;

    if ('auth' in options) {
      this.configureSession(router, admin, options);
    }

    this.registerAssets(router, assets, options);
    this.registerRoutes(router, admin, routes, options);

    app.use(options.adminBroOptions.rootPath, router);
  }

  private registerAssets(app, assets, options: AdminModuleOptions) {
    assets.forEach(asset => {
      app.get(asset.path, (_req, res) => {
        res.sendFile(path.resolve(asset.src))
      })
    })
  }

  private registerRoutes(app, admin: AdminBro, routes, options: AdminModuleOptions) {
    routes.forEach((route) => {
      // we have to change routes defined in AdminBro from {recordId} to :recordId
      const expressPath = `${route.path.replace(/{/g, ':').replace(/}/g, '') as string}`

      const handler = async (req, res, next) => {
        try {
          const controller = new route.Controller({ admin }, req.session && req.session.adminUser)
          const { params, query } = req
          const method = req.method.toLowerCase()
          const payload = {
            ...(req.fields || {}),
            ...(req.files || {}),
          }
          const html = await controller[route.action]({
            ...req,
            params,
            query,
            payload,
            method,
          }, res)
          if (route.contentType) {
            res.set({ 'Content-Type': route.contentType })
          }
          if (html) {
            res.send(html)
          }
        } catch (e) {
          next(e)
        }
      }
  
      if (route.method === 'GET') {
        app.get(expressPath, handler)
      }
  
      if (route.method === 'POST') {
        app.post(expressPath, handler)
      }
    })
  }

  private configureSession(app, admin: AdminBro, options: AdminModuleOptions) {
    const session = loadPackage('express-session', '@admin-bro/nestjs', () =>
      require('express-session')
    );

    app.use(session({
      ...options.sessionOptions,
      secret: options.auth?.cookiePassword,
      name: options.auth?.cookieName || 'adminbro',
    }));

    const { rootPath } = admin.options;
    let { loginPath, logoutPath } = admin.options;
    loginPath = loginPath.replace(rootPath, '')
    logoutPath = logoutPath.replace(rootPath, '')
  
    app.get(loginPath, async (_req, res) => {
      const login = await admin.renderLogin({
        action: admin.options.loginPath,
        errorMessage: null,
      });
      res.send(login);
    });
  
    app.post(loginPath, async (req, res, next) => {
      console.log('login post');
      const { email, password } = req.fields;
      const adminUser = await options.auth?.authenticate(email, password);
      if (adminUser) {
        req.session.adminUser = adminUser;
        req.session.save((err) => {
          if (err) {
            next(err);
          }
          if (req.session.redirectTo) {
            res.redirect(req.session.redirectTo);
          } else {
            res.redirect(rootPath);
          }
        })
      } else {
        const login = await admin.renderLogin({
          action: admin.options.loginPath,
          errorMessage: 'invalidCredentials',
        });
        res.send(login);
      }
    });
  
    app.use((req, res, next) => {
      console.log('redirect?')
      if (AdminBro.Router.assets.some(asset => req.originalUrl.match(asset.path))) {
        next();
      } else if (req.session.adminUser) {
        next();
      } else {
        // If the redirection is caused by API call to some action just redirect to resource
        const [redirectTo] = req.originalUrl.split('/actions');
        req.session.redirectTo = redirectTo.includes(`${rootPath}/api`) ? rootPath : redirectTo;
        req.session.save((err) => {
          if (err) {
            next(err);
          }
          res.redirect(admin.options.loginPath);
        })
      }
    })
  
    app.get(logoutPath, (req, res) => {
      req.session.destroy(() => {
        res.redirect(admin.options.loginPath)
      });
    });
  }
}
