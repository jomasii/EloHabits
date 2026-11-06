import { test } from "node:test";
import assert from "node:assert/strict";
import { estadoMascote } from "../domain/mascote";

const HOJE = "2026-11-10";
const base = { hoje: HOJE, inicioDupla: "2026-11-01" };

test("hoje completo é feliz", () => {
  assert.equal(estadoMascote({ ...base, diasCompletos: [HOJE] }), "feliz");
});
test("dupla nova, hoje aberto, é faminto", () => {
  assert.equal(estadoMascote({ hoje: HOJE, inicioDupla: HOJE, diasCompletos: [] }), "faminto");
});
test("dupla criada hoje com ontem anterior ao início não desmaia", () => {
  assert.equal(estadoMascote({ hoje: HOJE, inicioDupla: "2026-11-10", diasCompletos: [] }), "faminto");
});
test("ontem completo, hoje aberto, é faminto", () => {
  assert.equal(estadoMascote({ ...base, diasCompletos: ["2026-11-09"] }), "faminto");
});
test("ontem incompleto após o início da dupla, hoje aberto, é desmaiado", () => {
  assert.equal(estadoMascote({ ...base, diasCompletos: ["2026-11-05"] }), "desmaiado");
});
test("vários dias sem completar continua desmaiado", () => {
  assert.equal(estadoMascote({ ...base, diasCompletos: [] }), "desmaiado");
});
test("depois de desmaiar, os dois concluírem hoje volta direto a feliz", () => {
  assert.equal(estadoMascote({ ...base, diasCompletos: [HOJE, "2026-11-05"] }), "feliz");
});
