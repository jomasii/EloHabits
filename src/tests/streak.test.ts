import { test } from "node:test";
import assert from "node:assert/strict";
import { calcularStreak } from "../domain/streak";

const HOJE = "2026-11-10";

test("sem dias completos o streak é 0", () => assert.equal(calcularStreak([], HOJE), 0));
test("só hoje completo vale 1", () => assert.equal(calcularStreak([HOJE], HOJE), 1));
test("ontem e anteontem completos com hoje aberto valem 2 (dia aberto não quebra)", () => {
  assert.equal(calcularStreak(["2026-11-09", "2026-11-08"], HOJE), 2);
});
test("hoje completo mais dois dias anteriores vale 3", () => {
  assert.equal(calcularStreak([HOJE, "2026-11-09", "2026-11-08"], HOJE), 3);
});
test("um buraco interrompe a contagem", () => {
  assert.equal(calcularStreak([HOJE, "2026-11-09", "2026-11-07"], HOJE), 2);
});
test("nem hoje nem ontem completos vale 0", () => {
  assert.equal(calcularStreak(["2026-11-08"], HOJE), 0);
});
