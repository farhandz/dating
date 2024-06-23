import { Hono } from 'hono';
import { UserMiddleware } from '../types';
import * as controller from '../modules/controller/dashboardbi';

const dashboardbi = new Hono<{ Variables: UserMiddleware }>();

dashboardbi.get('/charter', async (c) => {
  return c.json(await controller.charter());
});

dashboardbi.get('/organization', async (c) => {
  return c.json(await controller.organizations());
});

dashboardbi.get('/stakeholder', async (c) => {
  return c.json(await controller.stakeholder());
});

dashboardbi.get('/contract', async (c) => {
  return c.json(await controller.contract());
});

dashboardbi.get('/risk', async (c) => {
  return c.json(await controller.risk());
});

dashboardbi.get('/deliverable', async (c) => {
  return c.json(await controller.deliverable());
});

dashboardbi.get('/top', async (c) => {
  return c.json(await controller.top());
});

dashboardbi.get('/top_telpro', async (c) => {
  return c.json(await controller.topTelpro());
});

export const dashboardbiRoute = dashboardbi;
