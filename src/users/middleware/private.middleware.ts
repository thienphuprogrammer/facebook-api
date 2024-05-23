import { FieldMiddleware, MiddlewareContext } from '@nestjs/graphql';
import { IContext } from '../../config/interfaces/context.interface';
import { IUsers } from '../interfaces';
import { isNull, isUndefined } from '../../common/utils/validation.util';

export const privateMiddleware: FieldMiddleware = async (
  ctx: MiddlewareContext<IUsers, IContext, unknown>,
  next
) => {
  const user = ctx.context.req.user;

  if (isUndefined(user) || isNull(user) || ctx.source.id !== user) {
    return null;
  }

  return next();
};
