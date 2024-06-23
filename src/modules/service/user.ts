import { BasicAuthRes, UserRes } from '../../types';
import { basicAuthBUilder, showBuilder } from '../sql/user';

export const show = async (id: string): Promise<UserRes> => {
  return await showBuilder(id);
};

export const basicauth = async (email: string): Promise<BasicAuthRes> => {
  return await basicAuthBUilder(email);
};
