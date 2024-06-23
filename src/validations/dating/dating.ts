import { z } from 'zod';

export const datingValidation = z.object({
  swiped_profile_id: z.number().int(),
  swipe_type_param: z.enum(['left', 'right']),
});
