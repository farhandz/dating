import { sign } from 'hono/jwt';
import { currDate } from './times';
import { TokenRes } from '../types/auth';

export const JwtGenerator = async (data: object): Promise<TokenRes> => {
  const secret = process.env.SECRET_KEY || '';
  const date = currDate();

  const payload = {
    ...data,
    iat: date.toUnixInteger(),
    exp: date.plus({ Hours: 1 }).toUnixInteger(),
    nbf: date.toUnixInteger(),
  };

  const payloadRefresh = {
    ...payload,
    exp: date.plus({ Days: 1 }).toUnixInteger(),
  };

  const token = await sign(payload, secret, 'HS512');
  const refresh_token = await sign(payloadRefresh, secret, 'HS512');

  return {
    token,
    refresh_token,
  };
};
