import { test, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "../api/server";
import { testDb, resetDb } from "./helpers/db";
import { novoUsuario, TEST_SECRET } from "./helpers/usuarios";

process.env.NODE_ENV = "test";
const db = testDb();
const app = buildApp({ jwtSecret: TEST_SECRET, jwtExpiresIn: "1h", db });

beforeEach(() => resetDb(db));
after(async () => {
  await app.close();
  await db.destroy();
});

const criar = (auth: { authorization: string }) => app.inject({ method: "POST", url: "/duplas", headers: auth });
const aceitar = (auth: { authorization: string }, codigo: string) =>
  app.inject({ method: "POST", url: "/duplas/aceitar", headers: auth, payload: { codigo } });

test("POST /duplas retorna 201 com código de 6 caracteres [A-Z0-9]", async () => {
  const a = await novoUsuario(db, "a@x.com");
  const res = await criar(a.auth);
  assert.equal(res.statusCode, 201);
  assert.match(res.json().codigo, /^[A-Z0-9]{6}$/);
});

test("usuário já em dupla recebe 409 ao criar outra", async () => {
  const a = await novoUsuario(db, "a@x.com");
  await criar(a.auth);
  assert.equal((await criar(a.auth)).statusCode, 409);
});

test("aceitar com código inexistente retorna 404", async () => {
  const b = await novoUsuario(db, "b@x.com");
  assert.equal((await aceitar(b.auth, "ZZZZZZ")).statusCode, 404);
});

test("aceitar o próprio convite retorna 409", async () => {
  const a = await novoUsuario(db, "a@x.com");
  const { codigo } = (await criar(a.auth)).json();
  assert.equal((await aceitar(a.auth, codigo)).statusCode, 409);
});

test("aceitar convite forma a dupla (200) e o convite não pode ser reutilizado (409)", async () => {
  const a = await novoUsuario(db, "a@x.com");
  const b = await novoUsuario(db, "b@x.com");
  const c = await novoUsuario(db, "c@x.com");
  const { codigo } = (await criar(a.auth)).json();
  assert.equal((await aceitar(b.auth, codigo)).statusCode, 200);
  assert.equal((await aceitar(c.auth, codigo)).statusCode, 409);
});

test("código é aceito em minúsculas e com espaços", async () => {
  const a = await novoUsuario(db, "a@x.com");
  const b = await novoUsuario(db, "b@x.com");
  const { codigo } = (await criar(a.auth)).json();
  assert.equal((await aceitar(b.auth, ` ${codigo.toLowerCase()} `)).statusCode, 200);
});

test("usuário que já está em dupla não pode aceitar outro convite (409)", async () => {
  const a = await novoUsuario(db, "a@x.com");
  const b = await novoUsuario(db, "b@x.com");
  const c = await novoUsuario(db, "c@x.com");
  await criar(b.auth);
  const { codigo } = (await criar(a.auth)).json();
  assert.equal((await aceitar(b.auth, codigo)).statusCode, 409);
  assert.equal((await aceitar(c.auth, codigo)).statusCode, 200);
});

test("duas requisições simultâneas de aceitar o mesmo código: exatamente uma retorna 200 e a outra 409", async () => {
  const a = await novoUsuario(db, "a@x.com");
  const b = await novoUsuario(db, "b@x.com");
  const c = await novoUsuario(db, "c@x.com");
  const { codigo } = (await criar(a.auth)).json();
  const codes = (await Promise.all([aceitar(b.auth, codigo), aceitar(c.auth, codigo)])).map((r) => r.statusCode).sort();
  assert.deepEqual(codes, [200, 409]);
});

test("sem token retorna 401", async () => {
  assert.equal((await app.inject({ method: "POST", url: "/duplas" })).statusCode, 401);
});
