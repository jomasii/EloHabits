# Uso de IA

O desenvolvimento do EloHabits usa o Claude Code como assistente (spec, plano, código, testes, documentos e automação do GitHub). O autor decide o escopo, revisa o que entra e faz os merges. Uma entrada por tarefa: o que foi pedido, o que ajudou e o que atrapalhou.

As entradas das tarefas 1–11 foram reconstruídas em 2026-11-10 a partir do histórico, e não no momento de cada tarefa. A partir da Tarefa 12, cada entrada é escrita junto com o trabalho.

| Tarefa | O que foi pedido | Ajudou | Atrapalhou |
|---|---|---|---|
| Spec e plano (06/11) | Desenhar o MVP final e um plano de 13 tarefas | Decisões fechadas cedo (mascote derivado, regra de streak, fuso), com corte de escopo em 20/11 | O plano em sequência levou a branches empilhadas |
| API: auth, duplas, hábitos, check-ins, status | Implementar as rotas com testes | 64 testes verdes; contrato OpenAPI atualizado junto | Testes de rota compartilham banco e exigem `--test-concurrency=1` |
| Domínio (fuso, streak, mascote) | TDD: teste antes da implementação | O commit do teste vem antes do da implementação, como evidência XP | — |
| App Expo | Cliente da API e telas | 31 testes de componente; telas escolhidas por função pura | Nunca testado em celular real até aqui |
| Compose e CI | Compose do zero, smoke test, jobs de CI | Smoke validado em clone limpo | O healthcheck com `localhost` falhou no Alpine (IPv6); corrigido para `127.0.0.1` |
| Merge da pilha de PRs (06–10/11) | Instruir a ordem de merge dos PRs empilhados | — | A instrução omitiu que é preciso apagar a branch entre os merges. Os PRs #12–#20 entraram em cadeia e só chegaram à `main` pelo #21. Custo: quatro dias e um PR extra |
| Proteção da `main` (10/11) | Aplicar a regra e provar o bloqueio com um PR que falha | Evidência objetiva: `BLOCKED` no PR #22 (`docs/evidencias/protecao-main.md`) | — |
| DORA (10/11) | Script reproduzível e documentos de medição | Números reproduzíveis por `scripts/dora.sh`; limitações declaradas | A primeira verificação de reprodutibilidade era falsa: as duas execuções falharam com o mesmo erro do GraphQL e o `diff` as mostrou "idênticas". Pego ao ler a saída |
| Retrospectiva 01 (10/11) | Reconstruir os fatos da Sprint 1 e propor ações | Fatos tirados de dados do GitHub, não de memória | As causas dos 5 Porquês são hipóteses da IA; só o autor pode confirmá-las |

## Avaliação

- **Onde a IA ajudou mais:** código com testes, texto repetitivo e conferência de dados do GitHub.
- **Onde atrapalhou:** em instruções de processo que pareciam completas e não eram (ordem de merge) e em verificações que não verificavam o que diziam (o `diff` de saídas com erro).
- **Prática adotada:** ler a saída de qualquer verificação antes de aceitar o "passou", e checar o estado real no GitHub depois de operações de merge.
