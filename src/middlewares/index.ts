import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { etag } from 'hono/etag';
import { logger } from 'hono/logger';
import { tokenMiddleware } from './token';
import { UserMiddleware } from '../types';

const app = new Hono<{ Variables: UserMiddleware }>();
const origin = process.env.ORIGINS ? process.env.ORIGINS.split(',') : ['*'];
const corsOpt = { origin };

// cors for all path
app.use('*', cors(corsOpt));

// logger for all path api just in development
app.use('*', etag(), logger());

app.use('*', async (c, next) => {
  const pattern =
    /^\/api\/v1(\/(auth\/login|user\/register|ping|auth\/register|external-access.*))?$/;

  const isNonAuthorizeRoute = pattern.test(c.req.path);
  console.log(c.req.path);
  if (!isNonAuthorizeRoute) {
    const data = await tokenMiddleware(c.req.header('authorization'));
    c.set('user', data);
  }

  await next();
});

export const Middleware = app;
