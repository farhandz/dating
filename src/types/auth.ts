import { z } from 'zod';
import { RegisterValidation } from '../validations/auth';
import { LoginValidation } from '../validations/auth/login';

export type AuthRegister = z.infer<typeof RegisterValidation>;
export type AuthLogin = z.infer<typeof LoginValidation>;
export type TokenRes = { token: string; refresh_token: string };
