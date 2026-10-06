exports.up = (knex) =>
  knex.schema.createTable("pairs", (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    t.text("codigo_convite").notNullable().unique();
    t.uuid("usuario_a_id").notNullable().references("id").inTable("users");
    // nulo até o convite ser aceito
    t.uuid("usuario_b_id").nullable().references("id").inTable("users");
    t.timestamp("criado_em", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.check("usuario_a_id <> usuario_b_id", [], "pairs_usuarios_distintos");
  });

exports.down = (knex) => knex.schema.dropTable("pairs");
