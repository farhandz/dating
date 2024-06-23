import { HonoRequest } from 'hono';
import { DatingSwipe } from '../types/dating';
import { datingValidation } from '../validations/dating/dating';
import { HTTPException } from 'hono/http-exception';

export const SwipePipe = async (body: HonoRequest): Promise<DatingSwipe> => {
  const validate = await datingValidation.safeParseAsync(body);
  if (!validate.success) {
    const error: any = 'error' in validate ? validate.error.format() : null;
    throw new HTTPException(422, {
      res: error,
      message: 'validation error',
    });
  }

  return validate.data;
};
