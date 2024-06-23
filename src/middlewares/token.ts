import { HTTPException } from 'hono/http-exception';
import { verify } from 'hono/jwt';
import { UserRes } from '../types';
import { basicauth, show } from '../modules/service/user';
import * as bcrypt from 'bcryptjs';

export const tokenMiddleware = async (
  token: string | undefined,
): Promise<UserRes> => {
  try {
    const secret = process.env.SECRET_KEY || '';
    if (!token) throw new Error('');
    const b64auth = (token || '').split(' ')[1] || '';
    const [email, password] = Buffer.from(b64auth, 'base64')
      .toString()
      .split(':');
    const bearerRegex = /Bearer\s+(\S+)/;
    const usejwt = bearerRegex.exec(token);
    // check is use jwt or basic auth
    if (!usejwt) {
      const login = await basicauth(email);
      if (!login) {
        throw new Error('Wrong Email');
      }
      const checkPassword = await bcrypt.compareSync(password, login.password);

      if (checkPassword) {
        return await show(login[0].id);
      } else {
        throw new Error('Wrong Password');
      }
    } else {
      const tokenStrip = token.replace('Bearer', '').trim();
      const data = await verify(tokenStrip, secret, 'HS512');
      return await show(data.user_id);
    }
  } catch (err: any) {
    const errorCode = 401;
    const errorMessage = err.message;
    // if (err.name && err.name === 'JwtTokenExpired') {
    //   errorCode = 403;
    //   errorMessage = 'Token expired';
    // }
    throw new HTTPException(errorCode, {
      message: errorMessage,
    });
  }
};
