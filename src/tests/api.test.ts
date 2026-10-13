import { test } from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "../api/server";
import { signToken } from "../domain/auth/jwt";

process.env.NODE_ENV = "test";
const secret = "segredo-de-teste";
const app = buildApp({ jwtSecret: secret });

test("GET /health responde ok", async () => {
  const res = await app.inject({ method: "GET", url: "/health" });
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.json(), { status: "ok" });
});

test("rota protegida sem token retorna 401", async () => {
  const res = await app.inject({ method: "GET", url: "/me" });
  assert.equal(res.statusCode, 401);
});

test("rota protegida com token inválido retorna 401", async () => {
  const res = await app.inject({
    method: "GET",
    url: "/me",
    headers: { authorization: "Bearer lixo" },
  });
  assert.equal(res.statusCode, 401);
});

test("rota protegida com token válido retorna o usuário", async () => {
  const token = signToken("user-1", { secret, expiresIn: "1h" });
  const res = await app.inject({
    method: "GET",
    url: "/me",
    headers: { authorization: `Bearer ${token}` },
  });
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.json(), { id: "user-1" });
});
