import { Hono } from 'hono';
import { UserMiddleware } from '../types';
import * as controller from '../modules/controller/auth';

const auth = new Hono<{ Variables: UserMiddleware }>();

auth.post('/register', async (c) => {
  return c.json(await controller.register(await c.req.json()));
});

auth.post('/login', async (c) => {
  return c.json(await controller.login(await c.req.json()));
});

export const authRoute = auth;
