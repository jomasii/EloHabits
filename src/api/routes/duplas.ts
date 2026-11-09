import { FastifyInstance } from "fastify";
import { Knex } from "knex";
import { authenticate } from "../auth-middleware";
import { aceitarConvite, criarDupla } from "../../infra/repos/pairs";

export function registrarDuplas(app: FastifyInstance, opts: { db: Knex; jwtSecret: string }): void {
  const { db, jwtSecret } = opts;
  const preHandler = authenticate(jwtSecret);

  app.post("/duplas", { preHandler }, async (request, reply) => {
    const dupla = await criarDupla(db, request.userId!);
    if (!dupla) return reply.code(409).send({ erro: "você já está em uma dupla" });
    return reply.code(201).send({ id: dupla.id, codigo: dupla.codigo });
  });

  app.post("/duplas/aceitar", { preHandler }, async (request, reply) => {
    const { codigo } = (request.body ?? {}) as { codigo?: unknown };
    if (typeof codigo !== "string" || codigo.trim() === "") {
      return reply.code(400).send({ erro: "código é obrigatório" });
    }
    const resultado = await aceitarConvite(db, request.userId!, codigo.trim().toUpperCase());
    switch (resultado) {
      case "ok":
        return { ok: true };
      case "inexistente":
        return reply.code(404).send({ erro: "código inexistente" });
      case "propria":
        return reply.code(409).send({ erro: "você não pode aceitar o próprio convite" });
      case "ja_em_dupla":
        return reply.code(409).send({ erro: "você já está em uma dupla" });
      case "ja_preenchida":
        return reply.code(409).send({ erro: "este convite já foi usado" });
    }
  });
}
