import { Knex } from "knex";
import { createDb } from "../../infra/db";

export function testDb(): Knex {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL é obrigatório para os testes de integração");
  return createDb(url);
}

export async function resetDb(db: Knex): Promise<void> {
  await db.raw("TRUNCATE users, pairs, habits, checkins RESTART IDENTITY CASCADE");
}
