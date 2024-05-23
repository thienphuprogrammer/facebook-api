import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { FastifyReply, FastifyRequest } from 'fastify';

@Injectable()
export class FastifyThrottlerGuard extends ThrottlerGuard {
  public getRequestResponse(context: ExecutionContext): {
    req: FastifyRequest;
    res: FastifyReply;
  } {
    const http = context.switchToHttp();
    console.log(
      'FastifyThrottlerGuard -> getRequestResponse -> context',
      http.getRequest<FastifyRequest>(),
      http.getResponse<FastifyReply>()
    );
    return {
      req: http.getRequest<FastifyRequest>(),
      res: http.getResponse<FastifyReply>(),
    };
  }
}
