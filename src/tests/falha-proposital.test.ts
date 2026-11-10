import { test } from 'node:test';
import assert from 'node:assert/strict';

// Teste que falha de propósito: prova que a proteção da main bloqueia o merge.
// NÃO mergear. Fechar o PR e apagar a branch depois de registrar a evidência.
test('falha proposital para provar a proteção da main', () => {
  assert.equal(1 + 1, 3);
});
