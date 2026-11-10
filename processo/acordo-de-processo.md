# Acordo de Processo

Versão resumida do acordo detalhado em `docs/proposta.md` (seção 5), com ajustes da Sprint 0.

## Cadência
- Sprints de 2 semanas. Planejamento na segunda inicial (30 min); retrospectiva na sexta final (40 min).
- Daily log em issue dedicada: o que foi feito, próxima etapa, dificuldades.
- Capacidade: 2–3 dias por semana (~20 h por sprint).

## Papéis
Desenvolvedor e Gestor de Processo: João Freitas (solo).

## Ferramentas
GitHub (repositório, Actions), GitHub Projects (quadro), Docker, Node.js/TypeScript, PostgreSQL.

## Limites de WIP
Em progresso: 1. Em revisão: 1. O limite conta cartões e PRs abertos.

## Política das colunas
Nomes iguais aos do quadro no GitHub Projects.

| Coluna | Entra quando | Sai quando | WIP |
|---|---|---|---|
| Backlog | a ideia virou issue com critérios de aceitação | é escolhida para a sprint | — |
| Ready | está quebrada em tarefa de poucos dias, com dono e `Target date` (equivale ao Sprint Backlog) | o desenvolvedor a puxa e In progress está vazio | — |
| In progress | há branch aberta e `Start date` preenchida | PR aberto com CI rodando | 1 |
| In review | PR aberto com checklist de auto-revisão | CI verde, checklist preenchido e merge | 1 |
| Done | merge na `main` com CI verde | — | — |

Quando uma coluna de trabalho enche, não se puxa trabalho novo: termina-se o que já está lá.

## Prática XP
- **TDD no domínio** (`src/domain/`): o commit do teste vem antes do commit da implementação, visível no histórico do PR.
- **Integração contínua**: todo PR roda CI; branches curtas, uma por tarefa, integradas com frequência. Toda branch parte da `main` atualizada, nunca de outra branch aberta (sem PR empilhado), e é apagada ao mergear.
- **Bloco diário de revisão** (desde 2026-11-11): horário fixo para revisar e mergear PRs com CI verde. Detalhes em `docs/fluxo-de-valor.md`.

## Definição de Pronto
1. Critérios de aceitação da história validados.
2. Regras de negócio cobertas por testes automatizados.
3. CI verde (lint, tipos, testes, build da imagem Docker).
4. Checklist de auto-review preenchido no PR.
5. Código integrado em `main`.
6. Migrações aplicam do zero e documentação afetada atualizada.

## Checklist de auto-review (PR)
- [ ] Testes das regras de domínio executados com sucesso
- [ ] Sem `console.log`, segredos ou artefatos de build versionados
- [ ] Lint e typecheck sem erros
- [ ] Documentação/ADR atualizada, se aplicável
