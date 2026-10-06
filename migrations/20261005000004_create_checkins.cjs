exports.up = (knex) =>
  knex.schema.createTable("checkins", (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    t.uuid("habit_id").notNullable();
    t.uuid("usuario_id").notNullable();
    // garante que o check-in pertence ao dono do hábito
    t.foreign(["habit_id", "usuario_id"]).references(["id", "usuario_id"]).inTable("habits");
    t.date("data").notNullable();
    t.boolean("concluido").notNullable().defaultTo(false);
    t.timestamp("criado_em", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.unique(["habit_id", "data"]);
  });

exports.down = (knex) => knex.schema.dropTable("checkins");
