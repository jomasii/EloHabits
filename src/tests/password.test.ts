import { test } from "node:test";
import assert from "node:assert/strict";
import { hashPassword, verifyPassword } from "../domain/auth/password";

test("hash não contém a senha em texto e valida a senha correta", async () => {
  const hash = await hashPassword("segredo123");
  assert.notEqual(hash, "segredo123");
  assert.equal(await verifyPassword("segredo123", hash), true);
});

test("rejeita senha incorreta", async () => {
  const hash = await hashPassword("segredo123");
  assert.equal(await verifyPassword("outra", hash), false);
});
