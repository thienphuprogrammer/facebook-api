import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IContext } from '../../config/interfaces/context.interface';

export const Origin = createParamDecorator(
  (_, context: ExecutionContext): string | undefined => {
    if (context.getType() === 'http') {
      return context.switchToHttp().getRequest<FastifyRequest>().headers
        ?.origin;
    }
    return GqlExecutionContext.create(context).getContext<IContext>().req
      .headers?.origin;
  }
);
