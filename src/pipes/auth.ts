import { HonoRequest } from 'hono';
import { AuthLogin, AuthRegister } from '../types/auth';
import { RegisterValidation } from '../validations/auth';
import { HTTPException } from 'hono/http-exception';
import { LoginValidation } from '../validations/auth/login';

export const RegisterPipe = async (
  body: HonoRequest,
): Promise<AuthRegister> => {
  const validate = RegisterValidation.safeParse(body);
  if (!validate.success) {
    const error: any = 'error' in validate ? validate.error.format() : null;
    throw new HTTPException(422, {
      res: error,
      message: 'validation error',
    });
  }

  return validate.data;
};

export const LoginPipe = async (body: HonoRequest): Promise<AuthLogin> => {
  const validate = await LoginValidation.safeParseAsync(body);
  if (!validate.success) {
    const error: any = 'error' in validate ? validate.error.format() : null;
    throw new HTTPException(422, {
      res: error,
      message: 'validation error',
    });
  }

  return validate.data;
};
