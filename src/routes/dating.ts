import { Context, Hono } from 'hono';
import { UserMiddleware } from '../types';
import * as controller from '../modules/controller/dating';

const dating = new Hono<{ Variables: UserMiddleware }>();

dating.post('/view', async (c: Context) => {
  return c.json(await controller.getProfile(c));
});

dating.post('/swipe', async (c: Context) => {
  return c.json(await controller.swipe(await c.req.json(), c));
});

export const datingroute = dating;
