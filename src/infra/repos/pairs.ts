import { randomInt } from "node:crypto";
import { Knex } from "knex";

const ALFABETO = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const TAMANHO_CODIGO = 6;
const PG_UNIQUE_VIOLATION = "23505";

export interface DuplaRow {
  id: string;
  codigo: string;
  usuarioAId: string;
  usuarioBId: string | null;
  criadoEm: Date;
}

function gerarCodigo(): string {
  let codigo = "";
  for (let i = 0; i < TAMANHO_CODIGO; i++) codigo += ALFABETO[randomInt(ALFABETO.length)];
  return codigo;
}

export async function buscarDuplaDoUsuario(db: Knex | Knex.Transaction, usuarioId: string): Promise<DuplaRow | undefined> {
  const row = await db("pairs")
    .where({ usuario_a_id: usuarioId })
    .orWhere({ usuario_b_id: usuarioId })
    .first();
  return row && {
    id: row.id,
    codigo: row.codigo_convite,
    usuarioAId: row.usuario_a_id,
    usuarioBId: row.usuario_b_id,
    criadoEm: row.criado_em,
  };
}

/** Retorna undefined se o usuário já está em uma dupla. */
export async function criarDupla(db: Knex, usuarioId: string): Promise<{ id: string; codigo: string } | undefined> {
  if (await buscarDuplaDoUsuario(db, usuarioId)) return undefined;
  for (;;) {
    const codigo = gerarCodigo();
    try {
      const [row] = await db("pairs").insert({ codigo_convite: codigo, usuario_a_id: usuarioId }).returning("id");
      return { id: row.id, codigo };
    } catch (err) {
      if ((err as { code?: string }).code !== PG_UNIQUE_VIOLATION) throw err;
    }
  }
}

export type ResultadoConvite = "ok" | "inexistente" | "propria" | "ja_preenchida" | "ja_em_dupla";

export function aceitarConvite(db: Knex, usuarioId: string, codigo: string): Promise<ResultadoConvite> {
  return db.transaction(async (trx) => {
    if (await buscarDuplaDoUsuario(trx, usuarioId)) return "ja_em_dupla";
    const par = await trx("pairs").where({ codigo_convite: codigo }).first();
    if (!par) return "inexistente";
    if (par.usuario_a_id === usuarioId) return "propria";
    const afetadas = await trx("pairs")
      .where({ id: par.id })
      .whereNull("usuario_b_id")
      .update({ usuario_b_id: usuarioId });
    return afetadas === 1 ? "ok" : "ja_preenchida";
  });
}
