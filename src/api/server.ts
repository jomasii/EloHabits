import Fastify, { FastifyInstance } from "fastify";
import { Knex } from "knex";
import { authenticate } from "./auth-middleware";
import { registrarAuth } from "./routes/auth";
import { registrarDuplas } from "./routes/duplas";
import { registrarHabitos } from "./routes/habitos";
import { registrarCheckins } from "./routes/checkins";

export interface AppOptions {
  jwtSecret: string;
  jwtExpiresIn: string;
  db: Knex;
  /** Relógio injetável para testes. */
  agora?: () => Date;
}

export function buildApp({ jwtSecret, jwtExpiresIn, db, agora = () => new Date() }: AppOptions): FastifyInstance {
  const app = Fastify({ logger: process.env.NODE_ENV !== "test" });

  app.get("/health", async () => ({ status: "ok" }));

  app.get("/me", { preHandler: authenticate(jwtSecret) }, async (request) => ({
    id: request.userId,
  }));

  registrarAuth(app, { db, jwtSecret, jwtExpiresIn });
  registrarDuplas(app, { db, jwtSecret });
  registrarHabitos(app, { db, jwtSecret });
  registrarCheckins(app, { db, jwtSecret, agora });

  return app;
}
