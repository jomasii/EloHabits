import { Knex } from "knex";

/** Idempotente por (habit_id, data). Retorna true se criou, false se já existia. */
export async function registrarCheckin(db: Knex, habitId: string, usuarioId: string, data: string): Promise<boolean> {
  const rows = await db("checkins")
    .insert({ habit_id: habitId, usuario_id: usuarioId, data, concluido: true })
    .onConflict(["habit_id", "data"])
    .ignore()
    .returning("id");
  return rows.length === 1;
}

/** Datas (YYYY-MM-DD) em que os dois membros da dupla têm check-in concluído. */
export async function diasCompletosDaDupla(db: Knex, pairId: string): Promise<string[]> {
  const result = await db.raw(
    `SELECT c.data::text AS data
       FROM checkins c JOIN habits h ON h.id = c.habit_id
      WHERE h.pair_id = ? AND c.concluido
      GROUP BY c.data
     HAVING COUNT(DISTINCT c.usuario_id) = 2
      ORDER BY c.data`,
    [pairId],
  );
  return result.rows.map((r: { data: string }) => r.data);
}

export async function checkinsDeHoje(db: Knex, pairId: string, hoje: string): Promise<Set<string>> {
  const rows = await db("checkins as c")
    .join("habits as h", "h.id", "c.habit_id")
    .where({ "h.pair_id": pairId, "c.data": hoje, "c.concluido": true })
    .select("c.usuario_id");
  return new Set(rows.map((r: { usuario_id: string }) => r.usuario_id));
}
