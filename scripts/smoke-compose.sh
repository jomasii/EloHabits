#!/usr/bin/env bash
# Prova que `docker compose up` funciona do zero: sobe a stack, espera os healthchecks e chama /health.
set -euo pipefail
cd "$(dirname "$0")/.."
trap 'docker compose logs --tail=50 || true; docker compose down -v >/dev/null 2>&1 || true' EXIT
docker compose up -d --build --wait --wait-timeout 180
curl -fsS "http://localhost:${PORT:-3000}/health"
echo
