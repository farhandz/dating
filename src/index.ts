import { Hono } from 'hono';
import { Route } from './routes';
import { Exception } from './helpers/exception';
import { Middleware } from './middlewares';
import database from './database';

import 'reflect-metadata';

const port = parseInt(process.env.PORT || '3001');
const app = new Hono();

(async () => {
  await database.checkconnection();
})();

app.basePath('/api/v1').route('/', Middleware).route('/', Route);

app.onError((err, c) => Exception(err, c));

export default {
  fetch: app.fetch,
  port,
};
