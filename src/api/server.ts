import Fastify, { FastifyInstance } from "fastify";
import { authenticate } from "./auth-middleware";

export interface AppOptions {
  jwtSecret: string;
}

export function buildApp({ jwtSecret }: AppOptions): FastifyInstance {
  const app = Fastify({ logger: process.env.NODE_ENV !== "test" });

  app.get("/health", async () => ({ status: "ok" }));

  // Rota protegida mínima para exercitar o middleware; rotas reais entram na Sprint 1.
  app.get("/me", { preHandler: authenticate(jwtSecret) }, async (request) => ({
    id: request.userId,
  }));

  return app;
}
