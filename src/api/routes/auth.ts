import { FastifyInstance } from "fastify";
import { Knex } from "knex";
import { hashPassword, verifyPassword } from "../../domain/auth/password";
import { signToken } from "../../domain/auth/jwt";
import { criarUsuario, buscarUsuarioPorEmail } from "../../infra/repos/users";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SENHA_MIN = 6;
const PG_UNIQUE_VIOLATION = "23505";

interface Credenciais {
  email?: unknown;
  senha?: unknown;
}

function lerCredenciais(body: unknown): { email: string; senha: string } | string {
  const { email, senha } = (body ?? {}) as Credenciais;
  if (typeof email !== "string" || typeof senha !== "string") return "e-mail e senha são obrigatórios";
  const norm = email.trim().toLowerCase();
  if (!EMAIL_RE.test(norm)) return "e-mail inválido";
  if (senha.length < SENHA_MIN) return `senha deve ter ao menos ${SENHA_MIN} caracteres`;
  return { email: norm, senha };
}

export function registrarAuth(app: FastifyInstance, opts: { db: Knex; jwtSecret: string; jwtExpiresIn: string }): void {
  const { db, jwtSecret, jwtExpiresIn } = opts;

  app.post("/auth/cadastro", async (request, reply) => {
    const cred = lerCredenciais(request.body);
    if (typeof cred === "string") return reply.code(400).send({ erro: cred });
    try {
      const { id } = await criarUsuario(db, cred.email, await hashPassword(cred.senha));
      return reply.code(201).send({ id });
    } catch (err) {
      if ((err as { code?: string }).code === PG_UNIQUE_VIOLATION) {
        return reply.code(409).send({ erro: "e-mail já cadastrado" });
      }
      throw err;
    }
  });

  app.post("/auth/login", async (request, reply) => {
    const cred = lerCredenciais(request.body);
    if (typeof cred === "string") return reply.code(401).send({ erro: "credenciais inválidas" });
    const usuario = await buscarUsuarioPorEmail(db, cred.email);
    if (!usuario || !(await verifyPassword(cred.senha, usuario.senha_hash))) {
      return reply.code(401).send({ erro: "credenciais inválidas" });
    }
    return { token: signToken(usuario.id, { secret: jwtSecret, expiresIn: jwtExpiresIn }) };
  });
}
