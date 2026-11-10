import { test } from "node:test";
import assert from "node:assert/strict";
import { hojeFortaleza, ontem } from "../domain/tempo";

test("02:59:59Z de 07/11 ainda é 06/11 em Fortaleza", () => {
  assert.equal(hojeFortaleza(new Date("2026-11-07T02:59:59Z")), "2026-11-06");
});
test("03:00:00Z de 07/11 já é 07/11 em Fortaleza", () => {
  assert.equal(hojeFortaleza(new Date("2026-11-07T03:00:00Z")), "2026-11-07");
});
test("ontem cruza mês e ano", () => {
  assert.equal(ontem("2026-03-01"), "2026-02-28");
  assert.equal(ontem("2026-01-01"), "2025-12-31");
});
