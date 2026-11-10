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

export type Auth = { authorization: string };

/** Dois usuários com dupla formada (A criou, B aceitou). */
export async function novaDuplaCompleta(db: Knex) {
  const { criarDupla, aceitarConvite } = await import("../../infra/repos/pairs");
  const a = await novoUsuario(db, "a@x.com");
  const b = await novoUsuario(db, "b@x.com");
  const dupla = (await criarDupla(db, a.id))!;
  await aceitarConvite(db, b.id, dupla.codigo);
  return { a, b, pairId: dupla.id, codigo: dupla.codigo };
}
