import { z } from 'zod';
import { datingValidation } from '../validations/dating/dating';

export interface profileType {
  profile_id: number;
  user_id: number;
  profile_name: string;
  profile_age: number;
  profile_gender: 'male' | 'female' | 'other';
  profile_bio: string;
  username: string;
  email: string;
}

// Define the type
export type SwipeProfile = {
  swiped_profile_id: number;
  swipe_type_param: 'left' | 'right';
};

export type DatingSwipe = z.infer<typeof datingValidation>;
