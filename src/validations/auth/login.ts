import { z } from 'zod';
import * as bcrypt from 'bcryptjs';
import { basicauth } from '../../modules/service/user';

export const LoginValidation = z
  .object({
    email: z.string().email(),
    password: z.string().min(1).max(20),
  })
  .strict()
  .superRefine(async (schema, ctx) => {
    const user = await basicauth(schema.email);

    if (!user) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'email not registered',
        path: ['email'],
      });

      return z.NEVER;
    }

    const checkPassword = await bcrypt.compareSync(
      schema.password,
      user.password,
    );

    if (!checkPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'password invalid',
        path: ['password'],
      });

      return z.NEVER;
    }
  });
