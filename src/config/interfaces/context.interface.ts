import { FastifyReply, FastifyRequest } from 'fastify';

export interface IContext {
  req: FastifyRequest;
  res: FastifyReply;
}
