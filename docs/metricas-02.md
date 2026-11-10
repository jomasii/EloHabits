# Métricas DORA — Sprint 2

Gerado por `scripts/dora.sh` (dados da API do GitHub via `gh` e `jq`). Medição feita em 2026-11-10.

## Definições

- **Deployment**: merge na `main` com CI verde. O projeto não tem ambiente publicado, então o merge na `main` (com o CI do push verde) é o ponto de entrega.
- **Lead time**: do primeiro commit do PR até o merge. A espera do PR (abertura até o merge) é medida à parte, porque é o alvo da melhoria T7.
- **Frequência de deploys**: merges na `main` por semana ISO.
- **Taxa de falha**: execuções `failure` do CI nos pushes para a `main` ÷ execuções concluídas.
- **Período**: desde 2026-11-06 (início da Sprint 2). Para ver a Sprint 1, rode `SINCE=2026-10-01 bash scripts/dora.sh`.

## Como reproduzir

```bash
gh auth login        # uma vez
bash scripts/dora.sh
```

A saída não depende do horário de execução: duas execuções seguidas produzem o mesmo texto (conferido com `diff`).

## Resultado (2026-11-10)

| PR | Primeiro commit → merge | Abertura → merge |
|---|---|---|
| #11 | 69,3 h | 68,9 h |
| #21 | 93,6 h | 0,1 h |
| #23 | 0,1 h | 0,1 h |

- Mediana do lead time: **69,3 h**.
- Mediana da espera do PR: **0,1 h**.
- Frequência de deploys: **3 merges na semana 2026-W46**.
- Taxa de falha na `main`: **0 de 3 execuções (0%)**.

## Limitações e interpretação

- **Amostra mínima.** São 3 deployments, então a mediana não é estatística. Serve como linha de base e para provar que a medição é reproduzível.
- **Merges em cadeia (#12–#20).** Esses 9 PRs foram mergeados cada um na branch do anterior, não na `main`, porque as branches não foram apagadas entre os merges. O script os exclui (`--base main`). O conteúdo chegou à `main` pelo PR #21, e por isso o lead time dele (93,6 h) vai do primeiro commit da pilha (06/11) ao merge, e a espera dele é de 0,1 h. Esse é um fato de processo para a retrospectiva, não um ganho de velocidade.
- **Espera real da pilha.** Medida em todos os PRs #11–#20 (inclusive os em cadeia), a mediana da espera foi de **92,8 h**. Esse é o valor "antes" usado em `docs/fluxo-de-valor.md`.
- **Taxa de falha de 0%.** Desde a proteção da `main` (10/11), código com CI vermelho não entra. A falha provocada no PR #22 ficou na branch do PR, não na `main`, então não conta aqui. A taxa mede o que a `main` recebeu, não quantas vezes o CI pegou erro (ver `docs/evidencias/protecao-main.md`).
- **Tempo de restauração (MTTR).** Não medido: não houve falha na `main` no período.
- **Trabalho solo.** Não há tempo de revisão por outra pessoa. A espera do PR é a espera do próprio autor até revisar e mergear.
