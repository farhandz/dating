import { HTTPException } from 'hono/http-exception';
import { SwipeProfile, profileType } from '../../types/dating';
import { GetProfilesBuilder, SwipeBuilder } from '../sql/dating';

export const profileswipe = async (
  swiper_id: string,
  premium: boolean,
): Promise<profileType[]> => {
  console.log(premium);
  const data = await GetProfilesBuilder(swiper_id);
  return data;
};

export const swipedProfile = async (body: SwipeProfile, swiper_id: number) => {
  try {
    await SwipeBuilder(
      swiper_id,
      body.swiped_profile_id,
      body.swipe_type_param,
    );
    return {
      message: `sukses swipe profile ${body.swiped_profile_id}`,
      data: null,
      code: 200,
    };
  } catch (error: any) {
    throw new HTTPException(500, {
      message: error.message,
    });
  }
};
