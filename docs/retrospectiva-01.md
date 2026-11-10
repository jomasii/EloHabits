# Retrospectiva 01 — Sprint 1

Escrita em 2026-11-10. A Sprint 1 (prazo 2026-10-16) não foi entregue no prazo e nenhuma retrospectiva foi feita na época. Este documento reconstrói os fatos a partir do histórico do GitHub, sem simular uma retro antiga.

## Fatos

Todos conferíveis em `docs/log-fluxo.md` e no quadro.

1. **WIP estourado.** O acordo limita In progress a 1 e In review a 1. Houve 3 cartões em paralelo, e em 06/11 dez PRs (#11–#20) ficaram em In review ao mesmo tempo.
2. **PR parado por 7 dias.** O PR #9 ficou aberto de 06/10 a 13/10 (182,6 h). O CI levou cerca de 1 min.
3. **Sem datas de início.** Os cartões não tinham `Start date`, então não há como medir o tempo em progresso.
4. **Sprint 1 fora do prazo.** A entrega de 16/10 não aconteceu. O trabalho de produto voltou em 06/11.
5. **PRs em pilha.** A pilha de 10 PRs (#11–#20) foi mergeada em cadeia, cada um na branch do anterior. O conteúdo só chegou à `main` pelo PR #21, em 10/11, quatro dias depois de aberto. As branches não foram apagadas entre os merges, e por isso o GitHub não reapontou as bases.
6. **Espera dominante.** Nos PRs #11–#20 a mediana entre abrir e mergear foi de 92,8 h, para um CI de cerca de 1,5 min (`docs/metricas-02.md`).

## Causas (5 Porquês)

As causas abaixo são a análise do autor a partir dos fatos. As etapas 3 a 5 são hipóteses, e o autor deve confirmar ou corrigir.

**PR #9 e a pilha esperaram dias.**
1. Por que esperaram? Ninguém revisou nem mergeou.
2. Por que ninguém revisou? O autor é o único revisor e trabalha em blocos de 2–3 dias por semana.
3. Por que o tempo de revisão não é reservado? O acordo define a capacidade, mas não define quando revisar.
4. Por que o acordo não define? Foi escrito pensando em trabalho, não em fila de revisão.
5. Causa raiz: o processo não trata a espera do PR como etapa com dono e horário.

**WIP estourado e pilha de PRs.**
1. Por que dez PRs abertos? Foi implementado o plano inteiro antes de integrar.
2. Por que antes de integrar? As tarefas dependiam umas das outras e cada branch partiu da anterior.
3. Por que dependiam? O plano foi desenhado em sequência, sem fatiar por entrega integrável na `main`.
4. Por que a regra de WIP não impediu? O quadro não bloqueia o fluxo: o limite é só um combinado.
5. Causa raiz: o WIP 1 não foi aplicado ao PR, só ao cartão. Abrir PR empilhado parecia trabalho feito, mas era trabalho parado.

## Ações (máximo 3)

| # | Ação | Dono | Prazo | Como verificar |
|---|---|---|---|---|
| 1 | Bloco diário fixo de revisão de PRs (melhoria T7) | João Freitas | início 11/11, medição até 18/11 | Mediana da espera do PR ≤ 24 h em `scripts/dora.sh` |
| 2 | Proibir PR empilhado: toda branch parte da `main` atualizada, e o repositório apaga a branch ao mergear | João Freitas | 11/11 | Nenhum PR novo com base diferente de `main` |
| 3 | Preencher `Start date` ao puxar o cartão e registrar o PR em `docs/log-fluxo.md` | João Freitas | a partir de 11/11 | Todo cartão em Done com `Start date` e linha no log |

## Revisão do acordo de processo

- A regra "uma branch por tarefa, integrada com frequência" passa a dizer que a branch parte da `main`, nunca de outra branch aberta (ação 2).
- A regra de WIP passa a contar PRs abertos, não só cartões (ação 2).
- O acordo ganha o bloco diário de revisão como prática (ação 1).

As mudanças estão aplicadas em `processo/acordo-de-processo.md`.

## Limitações dos dados

- Não há retro nem daily da Sprint 1 da época. Os fatos vêm do GitHub (PRs, commits, runs) e do quadro.
- A amostra é pequena: um autor, poucos PRs.
- As causas são análise do autor, não medição.

## Critérios que não se aplicam por ser trabalho solo

- Revisão do PR por outro integrante: o autor revisa o próprio PR pelo checklist de auto-revisão.
- Critérios de participação de "todos os integrantes".
