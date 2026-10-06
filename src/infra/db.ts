import knex, { Knex } from "knex";

export function createDb(databaseUrl: string): Knex {
  return knex({ client: "pg", connection: databaseUrl });
}
