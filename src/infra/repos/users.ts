import { Knex } from "knex";

export interface UsuarioRow {
  id: string;
  senha_hash: string;
}

/** Lança o erro do Postgres (código 23505) se o e-mail já existir. */
export async function criarUsuario(db: Knex, email: string, senhaHash: string): Promise<{ id: string }> {
  const [row] = await db("users").insert({ email, senha_hash: senhaHash }).returning("id");
  return { id: row.id };
}

export function buscarUsuarioPorEmail(db: Knex, email: string): Promise<UsuarioRow | undefined> {
  return db("users").select("id", "senha_hash").where({ email }).first<UsuarioRow | undefined>();
}
