import { Context, HonoRequest } from 'hono';
import { profileswipe, swipedProfile } from '../service/dating';
import { GeneralResponse } from '../../types';
import { SwipePipe } from '../../pipes/dating';

export const getProfile = async (c: Context): Promise<GeneralResponse> => {
  const user = c.get('user');
  const data = await profileswipe(user.id, user.premium);

  return { message: `sukses get profile swipe`, data, code: 200 };
};

export const swipe = async (body: HonoRequest, c: Context) => {
  const user = c.get('user');
  return swipedProfile(await SwipePipe(body), user.id);
};
