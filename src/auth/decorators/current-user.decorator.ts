import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IContext } from '../../config/interfaces/context.interface';

export const CurrentUser = createParamDecorator(
  (_, context: ExecutionContext): number | undefined => {
    if (context.getType() === 'http') {
      return context.switchToHttp().getRequest<FastifyRequest>()?.user;
    }
    return GqlExecutionContext.create(context).getContext<IContext>().req?.user;
  }
);
