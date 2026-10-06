exports.up = (knex) =>
  knex.schema.createTable("habits", (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    t.uuid("usuario_id").notNullable().unique().references("id").inTable("users"); // MVP: 1 hábito por usuário
    t.uuid("pair_id").notNullable().references("id").inTable("pairs");
    t.text("descricao").notNullable();
    t.timestamp("criado_em", { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });

exports.down = (knex) => knex.schema.dropTable("habits");
