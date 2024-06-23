import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { dashboardbiRoute } from './dashboardbi';
import { authRoute } from './auth';
import { datingroute } from './dating';

//NEXT_GEN_IMPORT_ROUTE_MODULE

export const app = new Hono();

app.get('/', (c) =>
  c.json({
    message: '[__ENV__] tomps-pm-svc-dashboard -> updated-with-build-n-__bn__',
    data: null,
    code: 200,
  }),
);
app.get('/ping', (c) =>
  c.json({
    message: '[__ENV__] tomps-pm-svc-dashboard -> updated-with-build-n-__bn__',
    data: null,
    code: 200,
  }),
);

app.route('/dashboardbi', dashboardbiRoute);
app.route('/auth', authRoute);
app.route('/dating', datingroute);
// app.route('/notification', notificationRoute);
//NEXT_GEN_ROUTE_MODULE

app.all('*', () => {
  throw new HTTPException(404, {
    message: 'route not found',
  });
});

export const Route = app;
