import { test } from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../infra/config";

const base = { DATABASE_URL: "postgres://x", NODE_ENV: "production" };

test("produção rejeita JWT_SECRET curto", () => {
  assert.throws(() => loadConfig({ ...base, JWT_SECRET: "curto" }), /ao menos 32/);
});

test("produção rejeita o placeholder do .env.example", () => {
  const secret = "troque-por-um-segredo-longo-e-aleatorio";
  assert.throws(() => loadConfig({ ...base, JWT_SECRET: secret }), /placeholder/);
});

test("produção aceita segredo longo e aleatório", () => {
  const config = loadConfig({ ...base, JWT_SECRET: "a".repeat(48) });
  assert.equal(config.jwtSecret.length, 48);
});

test("desenvolvimento aceita segredo curto", () => {
  const config = loadConfig({ DATABASE_URL: "postgres://x", JWT_SECRET: "dev" });
  assert.equal(config.jwtSecret, "dev");
});
