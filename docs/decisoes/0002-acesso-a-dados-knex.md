# ADR-0002 — Acesso a dados e migrações com Knex (sem ORM)

Status: aceita · Data: 2026-10-05

## Contexto
A proposta original citava Prisma. O esquema é pequeno (4 tabelas) e o tempo é curto.

## Decisão
Usar Knex para migrações versionadas e query builder. Sem ORM.

## Consequências
- Migrações em `migrations/` aplicam do zero com `npm run migrate`.
- SQL explícito e fácil de depurar; sem geração de código.
- Mapeamento entre linhas e objetos de domínio é feito à mão.
- As migrações são `.cjs` para rodar direto no container de produção, sem compilar.
