import { Knex } from "knex";
import { criarUsuario } from "../../infra/repos/users";
import { signToken } from "../../domain/auth/jwt";

export const TEST_SECRET = "segredo-de-teste";

/** Cria usuário direto no banco (sem bcrypt) e devolve id + header Authorization. */
export async function novoUsuario(db: Knex, email: string): Promise<{ id: string; auth: { authorization: string } }> {
  const { id } = await criarUsuario(db, email, "hash-falso");
  const token = signToken(id, { secret: TEST_SECRET, expiresIn: "1h" });
  return { id, auth: { authorization: `Bearer ${token}` } };
}
