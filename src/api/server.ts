import Fastify, { FastifyInstance } from "fastify";
import { Knex } from "knex";
import { authenticate } from "./auth-middleware";
import { registrarAuth } from "./routes/auth";

export interface AppOptions {
  jwtSecret: string;
  jwtExpiresIn: string;
  db: Knex;
}

export function buildApp({ jwtSecret, jwtExpiresIn, db }: AppOptions): FastifyInstance {
  const app = Fastify({ logger: process.env.NODE_ENV !== "test" });

  app.get("/health", async () => ({ status: "ok" }));

  app.get("/me", { preHandler: authenticate(jwtSecret) }, async (request) => ({
    id: request.userId,
  }));

  registrarAuth(app, { db, jwtSecret, jwtExpiresIn });

  return app;
}
