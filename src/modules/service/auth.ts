import { JwtGenerator } from '../../helpers/encryption';
import { UserRes } from '../../types';
import { AuthLogin, AuthRegister, TokenRes } from '../../types/auth';
import { RegisterBuilder } from '../sql/auth';
import { basicAuthBUilder, showBuilder } from '../sql/user';

export const register = async (body: AuthRegister): Promise<void> => {
  await RegisterBuilder(body);
};

export const login = async (body: AuthLogin): Promise<TokenRes> => {
  const user = await basicAuthBUilder(body.email);
  return await JwtGenerator({ user_id: user.id });
};

export const show = async (email: string): Promise<UserRes> => {
  return await showBuilder(email);
};
