# Evidência: proteção da `main`

Data: 2026-11-10 · Issue: #1

## Configuração aplicada

`gh api -X PUT repos/jomasii/EloHabits/branches/main/protection`

| Regra | Valor |
|---|---|
| Checks obrigatórios | `verificar`, `docker`, `compose-smoke`, `app` |
| Branch atualizada antes do merge (`strict`) | sim |
| Vale para administradores (`enforce_admins`) | sim |
| Force-push | bloqueado |
| Deleção da `main` | bloqueada |
| Revisão obrigatória | não (projeto solo: o autor não aprova o próprio PR; ver retrospectiva) |

## Prova do bloqueio

PR de teste [#22](https://github.com/jomasii/EloHabits/pull/22), com um teste que falha de propósito (`assert.equal(1 + 1, 3)`).

| Check | Resultado |
|---|---|
| `verificar` | **fail** |
| `docker` | skipping (depende de `verificar`) |
| `app` | pass |
| `compose-smoke` | pass |

Estado do merge segundo a API do GitHub: `mergeStateStatus: BLOCKED`.

Execução do CI: https://github.com/jomasii/EloHabits/actions/runs/42826400627

O PR #22 foi fechado sem merge e a branch `test/ci-falha-proposital` foi apagada.

## Contexto

A proteção só foi aplicada depois do merge da pilha de PRs (#11–#21), porque os jobs `compose-smoke` e `app` não existiam na `main` antes disso e bloqueariam a pilha. Os PRs #12–#20 foram mergeados em cadeia, cada um na branch do anterior, e chegaram na `main` pelo PR #21.
