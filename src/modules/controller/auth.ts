import { HonoRequest } from 'hono';
import { GeneralResponse } from '../../types';
import { LoginPipe, RegisterPipe } from '../../pipes/auth';
import * as service from '../service/auth';

export const register = async (body: HonoRequest): Promise<GeneralResponse> => {
  await service.register(await RegisterPipe(body));
  return { message: 'created', data: null, code: 200 };
};

export const login = async (body: HonoRequest): Promise<GeneralResponse> => {
  const data = await service.login(await LoginPipe(body));
  return { message: null, data, code: 200 };
};
