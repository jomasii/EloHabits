import { FastifyReply, FastifyRequest } from "fastify";
import { verifyToken } from "../domain/auth/jwt";

declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
  }
}

export function authenticate(secret: string) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const header = request.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return reply.code(401).send({ erro: "token ausente" });
    }
    try {
      request.userId = verifyToken(header.slice(7), secret).sub;
    } catch {
      return reply.code(401).send({ erro: "token inválido ou expirado" });
    }
  };
}
