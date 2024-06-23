import { pgConnection } from '../../database';
import { funcName } from '../../helpers/constant';
import { escapeIdentifier, Pool, QueryResult } from 'pg';
import { profileType } from '../../types/dating';
const db = new Pool(pgConnection);

export const GetProfilesBuilder = async (
  swiper_id: string,
): Promise<profileType[]> => {
  const profile_swiped = escapeIdentifier(funcName.GETSWIPE);
  const queryShow = {
    text: `SELECT * FROM ${profile_swiped}($1) WHERE profile_id != $1 LIMIT 1`,
    values: [swiper_id],
  };

  return (await db.query(queryShow)).rows;
};

export const SwipeBuilder = async (
  swiperId: number,
  swipedProfileId: number,
  swipeType: string,
): Promise<QueryResult> => {
  const queryShow = {
    text: 'SELECT swipe_profile($1, $2, $3)',
    values: [swiperId, swipedProfileId, swipeType],
  };
  return await db.query(queryShow);
};
