import { test, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "../api/server";
import { testDb, resetDb } from "./helpers/db";
import { novoUsuario, novaDuplaCompleta, TEST_SECRET, Auth } from "./helpers/usuarios";
import { criarDupla } from "../infra/repos/pairs";

process.env.NODE_ENV = "test";
const db = testDb();
const app = buildApp({ jwtSecret: TEST_SECRET, jwtExpiresIn: "1h", db });
beforeEach(() => resetDb(db));
after(async () => {
  await app.close();
  await db.destroy();
});

const habito = (auth: Auth, descricao: unknown) =>
  app.inject({ method: "POST", url: "/habitos", headers: auth, payload: { descricao } });

test("201 com descrição de até 50 caracteres", async () => {
  const { a } = await novaDuplaCompleta(db);
  const res = await habito(a.auth, "x".repeat(50));
  assert.equal(res.statusCode, 201);
  assert.equal(typeof res.json().id, "string");
});

test("400 com descrição vazia ou com 51 caracteres", async () => {
  const { a } = await novaDuplaCompleta(db);
  assert.equal((await habito(a.auth, "   ")).statusCode, 400);
  assert.equal((await habito(a.auth, "x".repeat(51))).statusCode, 400);
  assert.equal((await habito(a.auth, 42)).statusCode, 400);
});

test("409 sem dupla completa (sem dupla e com dupla aguardando parceiro)", async () => {
  const solo = await novoUsuario(db, "s@x.com");
  assert.equal((await habito(solo.auth, "Ler")).statusCode, 409);
  const esperando = await novoUsuario(db, "e@x.com");
  await criarDupla(db, esperando.id);
  assert.equal((await habito(esperando.auth, "Ler")).statusCode, 409);
});

test("409 ao criar o segundo hábito do mesmo usuário", async () => {
  const { a } = await novaDuplaCompleta(db);
  await habito(a.auth, "Ler");
  assert.equal((await habito(a.auth, "Correr")).statusCode, 409);
});
