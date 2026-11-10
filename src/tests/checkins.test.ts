import { test, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "../api/server";
import { testDb, resetDb } from "./helpers/db";
import { novoUsuario, novaDuplaCompleta, TEST_SECRET, Auth } from "./helpers/usuarios";
import { criarDupla } from "../infra/repos/pairs";
import { criarHabito } from "../infra/repos/habits";
import { registrarCheckin, diasCompletosDaDupla } from "../infra/repos/checkins";
import { hojeFortaleza } from "../domain/tempo";

process.env.NODE_ENV = "test";
const db = testDb();
const app = buildApp({ jwtSecret: TEST_SECRET, jwtExpiresIn: "1h", db });
beforeEach(() => resetDb(db));
after(async () => {
  await app.close();
  await db.destroy();
});

const checkin = (auth: Auth, payload?: unknown) =>
  app.inject({ method: "POST", url: "/checkins", headers: auth, payload: payload as object });

test("201 registra hoje (data via hojeFortaleza)", async () => {
  const { a, pairId } = await novaDuplaCompleta(db);
  await criarHabito(db, a.id, pairId, "Ler");
  const res = await checkin(a.auth);
  assert.equal(res.statusCode, 201);
  const rows = await db("checkins").select(db.raw("data::text as data"), "concluido");
  assert.deepEqual(rows, [{ data: hojeFortaleza(new Date()), concluido: true }]);
});

test("409 sem hábito", async () => {
  const { a } = await novaDuplaCompleta(db);
  assert.equal((await checkin(a.auth)).statusCode, 409);
});

test("409 sem dupla completa", async () => {
  const solo = await novoUsuario(db, "s@x.com");
  assert.equal((await checkin(solo.auth)).statusCode, 409);
  const esperando = await novoUsuario(db, "e@x.com");
  await criarDupla(db, esperando.id);
  assert.equal((await checkin(esperando.auth)).statusCode, 409);
});

test("repetir o check-in no mesmo dia retorna 200 e mantém 1 linha", async () => {
  const { a, pairId } = await novaDuplaCompleta(db);
  await criarHabito(db, a.id, pairId, "Ler");
  await checkin(a.auth);
  assert.equal((await checkin(a.auth)).statusCode, 200);
  assert.equal((await db("checkins")).length, 1);
});

test("o corpo não aceita data (sempre hoje)", async () => {
  const { a, pairId } = await novaDuplaCompleta(db);
  await criarHabito(db, a.id, pairId, "Ler");
  await checkin(a.auth, { data: "2020-01-01" });
  const [row] = await db("checkins").select(db.raw("data::text as data"));
  assert.equal(row.data, hojeFortaleza(new Date()));
});

test("diasCompletosDaDupla só inclui dias em que os dois concluíram", async () => {
  const { a, b, pairId } = await novaDuplaCompleta(db);
  const ha = await criarHabito(db, a.id, pairId, "Ler");
  const hb = await criarHabito(db, b.id, pairId, "Correr");
  await registrarCheckin(db, ha.id, a.id, "2026-11-01");
  await registrarCheckin(db, hb.id, b.id, "2026-11-01");
  await registrarCheckin(db, ha.id, a.id, "2026-11-02");
  assert.deepEqual(await diasCompletosDaDupla(db, pairId), ["2026-11-01"]);
});
