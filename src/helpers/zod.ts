import { z } from 'zod';

export const alphaNum = z.string().regex(/^[a-zA-Z0-9]+$/);
export const alphaNumDash = z.string().regex(/^[a-zA-Z0-9-]+$/);
export const tanbuCode = z.string().regex(/^[a-zA-Z0-9-.]+$/);
export const alphaNumSpace = z.string().regex(/^[a-zA-Z0-9 ]+$/);
export const alpha = z.string().regex(/^[a-zA-Z]+$/);
export const alphaSpace = z.string().regex(/^[a-zA-Z ]+$/);
export const alphaUnder = z.string().regex(/^[a-zA-Z_]+$/);
export const sortByString = z.string().regex(/^[a-zA-Z_,]+$/);
export const numString = z.string().regex(/^[0-9]+$/);
export const floatString = z.string().regex(/^[0-9.]+$/);
export const phoneCountry = z.string().regex(/^\+[0-9]+$/);
export const address = z.string().regex(/^[a-zA-Z0-9.,+\- ]+$/);
export const pinPoint = z
  .string()
  .regex(/^[-+]?\d{1,2}(?:\.\d+)?,\s*[-+]?\d{1,3}(?:\.\d+)?$/);
export const strongPassword = z
  .string()
  .regex(/^(?=[^\W_])(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).*[^\W_]$/);
