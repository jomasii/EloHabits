# Fluxo de valor

Em construção. Este arquivo ganha o diagrama, os tempos e o gargalo até 27/11 (plano, Tarefa 12, Step 7). Hoje ele registra a melhoria T7 iniciada.

## Melhoria T7 — bloco diário fixo de revisão

- **Problema observado.** Os PRs ficam abertos muito além do tempo de CI. Nos PRs #11–#20 a espera mediana (abertura → merge) foi de **92,8 h**; o PR #9 esperou 182,6 h. O CI leva cerca de 1,5 min. Quase toda a espera é fila até alguém revisar e mergear.
- **Hipótese.** Um bloco diário fixo de 30 min para revisar e mergear os PRs abertos reduz a espera, porque o PR deixa de depender de achar tempo avulso.
- **Mudança.** Todo dia útil, no mesmo horário, revisar o checklist de auto-revisão dos PRs abertos e mergear os que têm CI verde.
- **Dono.** João Freitas.
- **Métrica.** Mediana da espera do PR (abertura → merge), medida por `scripts/dora.sh`.
- **Valor antes.** 92,8 h (PRs #11–#20, 06/11 a 10/11).
- **Valor-alvo.** ≤ 24 h.
- **Início.** 2026-11-11. **Duração mínima.** 7 dias (até 2026-11-18).
- **Resultado.** A preencher após o período, com os PRs abertos de 11/11 em diante.

### Observações sobre a medição

- Com WIP 1, no máximo um PR fica em revisão por vez. O resultado depende de haver PRs suficientes no período; registrar quantos entraram.
- O horário do bloco precisa ser definido por quem executa e anotado no `docs/log-fluxo.md` no primeiro dia.
