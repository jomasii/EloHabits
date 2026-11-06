import { FastifyInstance } from "fastify";
import { Knex } from "knex";
import { authenticate } from "../auth-middleware";
import { buscarDuplaDoUsuario } from "../../infra/repos/pairs";
import { buscarHabito } from "../../infra/repos/habits";
import { registrarCheckin } from "../../infra/repos/checkins";
import { hojeFortaleza } from "../../domain/tempo";

export function registrarCheckins(app: FastifyInstance, opts: { db: Knex; jwtSecret: string; agora: () => Date }): void {
  const { db, jwtSecret, agora } = opts;

  app.post("/checkins", { preHandler: authenticate(jwtSecret) }, async (request, reply) => {
    const dupla = await buscarDuplaDoUsuario(db, request.userId!);
    if (!dupla || !dupla.usuarioBId) return reply.code(409).send({ erro: "forme uma dupla antes do check-in" });
    const habito = await buscarHabito(db, request.userId!);
    if (!habito) return reply.code(409).send({ erro: "cadastre seu hábito antes do check-in" });
    const criado = await registrarCheckin(db, habito.id, request.userId!, hojeFortaleza(agora()));
    return reply.code(criado ? 201 : 200).send({ ok: true });
  });
}
