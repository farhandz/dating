import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';

export const Exception = (err: Error, c: Context) => {
  if (err instanceof HTTPException) {
    c.status(err.status);
    return c.json({
      message: err.message,
      data:
        Object.keys(err.getResponse()).length > 0 ? err.getResponse() : null,
      code: err.status,
      stack: process.env.NODE_ENV === 'development' ? err.stack : null,
    });
  }

  c.status(500);
  return c.json({
    message: err.message,
    data: null,
    code: 500,
    stack: process.env.NODE_ENV === 'development' ? err.stack : null,
  });
};
