import { z } from 'zod';
import { alphaSpace, strongPassword } from '../../helpers/zod';

export const RegisterValidation = z
  .object({
    username: alphaSpace.min(1).max(255),
    email: z.string().email().max(255),
    password: strongPassword.min(8).max(16),
  })
  .strict();
