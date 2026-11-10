# Log de fluxo

Uma linha por PR: quando o trabalho começou, quando o PR abriu e quando entrou. Horários em UTC, vindos da API do GitHub. A partir do PR #24, registrar também o horário do CI verde e da revisão no momento em que acontecem.

| PR | Início (1º commit) | PR aberto | Merge | Base do merge | Observação |
|---|---|---|---|---|---|
| #9 | 2026-10-06 01:19 | 2026-10-06 02:08 | 2026-10-13 16:45 | `main` | Aberto por 7 dias (Sprint 1) |
| #10 | 2026-10-06 02:13 | 2026-10-06 02:21 | 2026-10-06 02:22 | `sprint1-setup` | Correções do code review |
| #11 | 2026-11-06 15:57 | 2026-11-06 16:18 | 2026-11-09 13:15 | `main` | Política das colunas, XP, spec e plano |
| #12 | 2026-11-06 15:59 | 2026-11-06 16:18 | 2026-11-09 13:15 | `docs/quadro-e-processo` | Merge em cadeia |
| #13 | 2026-11-06 16:00 | 2026-11-06 16:18 | 2026-11-09 13:28 | `feat/auth` | Merge em cadeia |
| #14 | 2026-11-06 16:00 | 2026-11-06 16:18 | 2026-11-09 19:31 | `feat/duplas` | Merge em cadeia |
| #15 | 2026-11-06 16:01 | 2026-11-06 16:18 | 2026-11-10 13:07 | `feat/dominio` | Merge em cadeia |
| #16 | 2026-11-06 16:02 | 2026-11-06 16:18 | 2026-11-10 13:12 | `feat/habitos-checkins` | Merge em cadeia |
| #17 | 2026-11-06 16:08 | 2026-11-06 16:18 | 2026-11-10 13:16 | `feat/status` | Merge em cadeia |
| #18 | 2026-11-06 16:09 | 2026-11-06 16:18 | 2026-11-10 13:17 | `feat/app-esqueleto` | Merge em cadeia |
| #19 | 2026-11-06 16:10 | 2026-11-06 16:19 | 2026-11-10 13:17 | `feat/app-auth` | Merge em cadeia |
| #20 | 2026-11-06 16:30 | 2026-11-06 16:33 | 2026-11-10 13:18 | `feat/app-telas` | Merge em cadeia |
| #21 | 2026-11-06 15:59 | 2026-11-10 13:33 | 2026-11-10 13:36 | `main` | Leva a pilha #12–#20 à `main`; CI verde (4 jobs) |
| #22 | 2026-11-10 | 2026-11-10 | fechado | — | PR de teste que falha de propósito; bloqueado pela proteção |
| #23 | 2026-11-10 13:41 | 2026-11-10 13:41 | 2026-11-10 13:44 | `main` | Evidência da proteção da `main` |

Os merges em cadeia (#12–#20) aparecem com a base da branch anterior: o conteúdo só chegou à `main` pelo #21.
