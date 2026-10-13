# ADR-0001 — Stack do backend: Node.js + Fastify + PostgreSQL

Status: aceita · Data: 2026-10-05

## Contexto
A ideia inicial era Kotlin + MongoDB. O projeto é solo, com 2–3 dias de trabalho por semana e prazo final em 2026-12-02. O domínio (usuários, duplas, hábitos, check-ins) é relacional.

## Decisão
Node.js 20 LTS + TypeScript + Fastify, com PostgreSQL 16. Deploy via Docker (Dockerfile multistage + docker-compose).

## Consequências
- Menor atrito e uma só linguagem se o cliente for React Native/Expo (TypeScript).
- Integridade referencial e restrições de unicidade (ex.: um check-in por hábito por dia) ficam no banco.
- Abandona-se Kotlin/MongoDB; a proposta foi atualizada para refletir isso.
