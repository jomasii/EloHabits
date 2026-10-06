import { test } from "node:test";
import assert from "node:assert/strict";
import { signToken, verifyToken } from "../domain/auth/jwt";

const opts = { secret: "s3", expiresIn: "1h" };

test("token assinado é verificado e devolve o id do usuário", () => {
  const token = signToken("user-1", opts);
  assert.equal(verifyToken(token, opts.secret).sub, "user-1");
});

test("rejeita token assinado com outro segredo", () => {
  const token = signToken("user-1", opts);
  assert.throws(() => verifyToken(token, "outro"));
});

test("rejeita token expirado", () => {
  const token = signToken("user-1", { secret: "s3", expiresIn: "-1s" });
  assert.throws(() => verifyToken(token, "s3"));
});

test("rejeita token assinado com algoritmo diferente de HS256", async () => {
  const { default: jwt } = await import("jsonwebtoken");
  const token = jwt.sign({}, "s3", { subject: "user-1", algorithm: "HS512" });
  assert.throws(() => verifyToken(token, "s3"));
});
