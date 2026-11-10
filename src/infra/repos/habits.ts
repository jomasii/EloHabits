import { Knex } from "knex";

/** Lança o erro do Postgres (23505) se o usuário já tem hábito. */
export async function criarHabito(db: Knex, usuarioId: string, pairId: string, descricao: string): Promise<{ id: string }> {
  const [row] = await db("habits").insert({ usuario_id: usuarioId, pair_id: pairId, descricao }).returning("id");
  return { id: row.id };
}

export function buscarHabito(db: Knex, usuarioId: string): Promise<{ id: string; descricao: string } | undefined> {
  return db("habits").select("id", "descricao").where({ usuario_id: usuarioId }).first();
}
