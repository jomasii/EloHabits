import { FastifyInstance } from "fastify";
import { Knex } from "knex";
import { authenticate } from "../auth-middleware";
import { buscarDuplaDoUsuario } from "../../infra/repos/pairs";
import { criarHabito } from "../../infra/repos/habits";

const MAX_DESCRICAO = 50;
const PG_UNIQUE_VIOLATION = "23505";

export function registrarHabitos(app: FastifyInstance, opts: { db: Knex; jwtSecret: string }): void {
  const { db, jwtSecret } = opts;

  app.post("/habitos", { preHandler: authenticate(jwtSecret) }, async (request, reply) => {
    const { descricao } = (request.body ?? {}) as { descricao?: unknown };
    const texto = typeof descricao === "string" ? descricao.trim() : "";
    if (texto === "" || texto.length > MAX_DESCRICAO) {
      return reply.code(400).send({ erro: `descrição deve ter de 1 a ${MAX_DESCRICAO} caracteres` });
    }
    const dupla = await buscarDuplaDoUsuario(db, request.userId!);
    if (!dupla || !dupla.usuarioBId) return reply.code(409).send({ erro: "forme uma dupla antes de cadastrar o hábito" });
    try {
      const { id } = await criarHabito(db, request.userId!, dupla.id, texto);
      return reply.code(201).send({ id });
    } catch (err) {
      if ((err as { code?: string }).code === PG_UNIQUE_VIOLATION) {
        return reply.code(409).send({ erro: "você já tem um hábito cadastrado" });
      }
      throw err;
    }
  });
}
