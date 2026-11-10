#!/usr/bin/env bash
# Métricas DORA do EloHabits a partir da API do GitHub (gh + jq).
# Deployment = merge na main com CI verde (ver docs/metricas-02.md).
# Uso: bash scripts/dora.sh            (período padrão: desde 2026-11-06)
#      SINCE=2026-10-01 bash scripts/dora.sh
set -euo pipefail

SINCE="${SINCE:-2026-11-06}"
REPO="${REPO:-jomasii/EloHabits}"

prs=$(gh pr list --repo "$REPO" --state merged --base main --limit 40 \
  --json number,createdAt,mergedAt,commits)
runs=$(gh run list --repo "$REPO" --branch main --event push --limit 200 \
  --json conclusion,createdAt,status)

echo "Período: desde $SINCE (merges na main)"
echo
echo "== Lead time e espera por PR =="
echo "PR | primeiro commit -> merge (h) | abertura -> merge (h)"
echo "$prs" | jq -r --arg since "$SINCE" '
  def t: fromdateiso8601;
  map(select(.mergedAt[0:10] >= $since))
  | sort_by(.number)[]
  | (.commits | map(.committedDate) | min) as $c
  | "#\(.number) | \(((.mergedAt|t) - ($c|t)) / 3600 | . * 10 | round / 10) | \(((.mergedAt|t) - (.createdAt|t)) / 3600 | . * 10 | round / 10)"'
echo
echo "Mediana do lead time (h):"
echo "$prs" | jq -r --arg since "$SINCE" '
  def t: fromdateiso8601;
  [.[] | select(.mergedAt[0:10] >= $since)
   | ((.mergedAt|t) - ((.commits|map(.committedDate)|min)|t)) / 3600]
  | sort | if length == 0 then "n/a"
    else (.[(length-1)/2|floor] + .[length/2|floor]) / 2 | . * 10 | round / 10 end'
echo "Mediana da espera do PR, abertura -> merge (h):"
echo "$prs" | jq -r --arg since "$SINCE" '
  def t: fromdateiso8601;
  [.[] | select(.mergedAt[0:10] >= $since)
   | ((.mergedAt|t) - (.createdAt|t)) / 3600]
  | sort | if length == 0 then "n/a"
    else (.[(length-1)/2|floor] + .[length/2|floor]) / 2 | . * 10 | round / 10 end'
echo
echo "== Frequência de deploys (merges na main por semana ISO) =="
echo "$prs" | jq -r --arg since "$SINCE" '
  map(select(.mergedAt[0:10] >= $since) | (.mergedAt|fromdateiso8601|strftime("%G-W%V")))
  | group_by(.)[] | "\(.[0]): \(length)"'
echo
echo "== Taxa de falha (execuções do CI na main) =="
echo "$runs" | jq -r --arg since "$SINCE" '
  map(select(.status == "completed" and .createdAt[0:10] >= $since)) as $r
  | ($r | length) as $n
  | ($r | map(select(.conclusion == "failure")) | length) as $f
  | "falhas: \($f) de \($n) execuções" +
    (if $n == 0 then "" else " (\($f * 100 / $n | . * 10 | round / 10)%)" end)'
