import { test, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "../api/server";
import { testDb, resetDb } from "./helpers/db";

process.env.NODE_ENV = "test";
const db = testDb();
const secret = "segredo-de-teste";
const app = buildApp({ jwtSecret: secret, jwtExpiresIn: "1h", db });

beforeEach(() => resetDb(db));
after(async () => {
  await app.close();
  await db.destroy();
});

const cadastro = (email: string, senha: string) =>
  app.inject({ method: "POST", url: "/auth/cadastro", payload: { email, senha } });

test("cadastro válido retorna 201", async () => {
  const res = await cadastro("a@x.com", "123456");
  assert.equal(res.statusCode, 201);
  assert.equal(typeof res.json().id, "string");
});

test("cadastro com senha curta (5 caracteres) retorna 400", async () => {
  const res = await cadastro("a@x.com", "12345");
  assert.equal(res.statusCode, 400);
  assert.equal(typeof res.json().erro, "string");
});

test("cadastro com e-mail inválido retorna 400", async () => {
  const res = await cadastro("nao-e-email", "123456");
  assert.equal(res.statusCode, 400);
});

test("cadastro com e-mail repetido retorna 409", async () => {
  await cadastro("a@x.com", "123456");
  const res = await cadastro("a@x.com", "123456");
  assert.equal(res.statusCode, 409);
});

test('e-mail é normalizado: "  A@X.com " e "a@x.com" colidem (409)', async () => {
  await cadastro("a@x.com", "123456");
  const res = await cadastro("  A@X.com ", "123456");
  assert.equal(res.statusCode, 409);
});

test("login válido retorna 200 com token que passa em /me", async () => {
  const c = await cadastro("a@x.com", "123456");
  const res = await app.inject({ method: "POST", url: "/auth/login", payload: { email: "A@x.com", senha: "123456" } });
  assert.equal(res.statusCode, 200);
  const me = await app.inject({ method: "GET", url: "/me", headers: { authorization: `Bearer ${res.json().token}` } });
  assert.equal(me.statusCode, 200);
  assert.deepEqual(me.json(), { id: c.json().id });
});

test("login com senha errada retorna 401", async () => {
  await cadastro("a@x.com", "123456");
  const res = await app.inject({ method: "POST", url: "/auth/login", payload: { email: "a@x.com", senha: "errada1" } });
  assert.equal(res.statusCode, 401);
});

test("login com e-mail inexistente retorna 401", async () => {
  const res = await app.inject({ method: "POST", url: "/auth/login", payload: { email: "z@x.com", senha: "123456" } });
  assert.equal(res.statusCode, 401);
});
