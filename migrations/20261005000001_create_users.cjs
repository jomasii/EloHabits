exports.up = (knex) =>
  knex.schema.createTable("users", (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    t.text("email").notNullable().unique();
    t.text("senha_hash").notNullable();
    t.timestamp("criado_em", { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });

exports.down = (knex) => knex.schema.dropTable("users");
