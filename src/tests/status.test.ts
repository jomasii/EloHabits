import { test, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "../api/server";
import { testDb, resetDb } from "./helpers/db";
import { novoUsuario, novaDuplaCompleta, TEST_SECRET, Auth } from "./helpers/usuarios";
import { criarDupla } from "../infra/repos/pairs";
import { criarHabito } from "../infra/repos/habits";
import { registrarCheckin } from "../infra/repos/checkins";
import { hojeFortaleza } from "../domain/tempo";

process.env.NODE_ENV = "test";
const db = testDb();
let relogio = () => new Date();
const app = buildApp({ jwtSecret: TEST_SECRET, jwtExpiresIn: "1h", db, agora: () => relogio() });
beforeEach(async () => {
  relogio = () => new Date();
  await resetDb(db);
});
after(async () => {
  await app.close();
  await db.destroy();
});

const status = async (auth: Auth) => (await app.inject({ method: "GET", url: "/duplas/status", headers: auth })).json();
const hoje = () => hojeFortaleza(relogio());

test("sem dupla: dupla null, streak 0, parceiro null", async () => {
  const u = await novoUsuario(db, "u@x.com");
  const s = await status(u.auth);
  assert.deepEqual(s, {
    dupla: null, streak: 0, mascote: "faminto",
    eu: { temHabito: false, concluidoHoje: false }, parceiro: null,
  });
});

test("dupla incompleta: completa false e parceiro null", async () => {
  const u = await novoUsuario(db, "u@x.com");
  const { codigo } = (await criarDupla(db, u.id))!;
  const s = await status(u.auth);
  assert.deepEqual(s.dupla, { codigo, completa: false });
  assert.equal(s.parceiro, null);
});

test("dupla completa e ninguém fez check-in: faminto", async () => {
  const { a } = await novaDuplaCompleta(db);
  const s = await status(a.auth);
  assert.equal(s.mascote, "faminto");
  assert.equal(s.dupla.completa, true);
  assert.deepEqual(s.parceiro, { temHabito: false, concluidoHoje: false });
});

test("os dois fizeram hoje: feliz e streak 1", async () => {
  const { a, b, pairId } = await novaDuplaCompleta(db);
  const ha = await criarHabito(db, a.id, pairId, "Ler");
  const hb = await criarHabito(db, b.id, pairId, "Correr");
  await registrarCheckin(db, ha.id, a.id, hoje());
  await registrarCheckin(db, hb.id, b.id, hoje());
  const s = await status(a.auth);
  assert.equal(s.mascote, "feliz");
  assert.equal(s.streak, 1);
});

test("só eu fiz: faminto, eu.concluidoHoje true e parceiro.concluidoHoje false", async () => {
  const { a, b, pairId } = await novaDuplaCompleta(db);
  const ha = await criarHabito(db, a.id, pairId, "Ler");
  await criarHabito(db, b.id, pairId, "Correr");
  await registrarCheckin(db, ha.id, a.id, hoje());
  const s = await status(a.auth);
  assert.equal(s.mascote, "faminto");
  assert.deepEqual(s.eu, { temHabito: true, concluidoHoje: true });
  assert.deepEqual(s.parceiro, { temHabito: true, concluidoHoje: false });
});

test("dias passados sem check-in dos dois: desmaiado e streak 0", async () => {
  const { a } = await novaDuplaCompleta(db);
  relogio = () => new Date(Date.now() + 3 * 24 * 3600 * 1000);
  const s = await status(a.auth);
  assert.equal(s.mascote, "desmaiado");
  assert.equal(s.streak, 0);
});

test("sem token retorna 401", async () => {
  assert.equal((await app.inject({ method: "GET", url: "/duplas/status" })).statusCode, 401);
});
