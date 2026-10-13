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
Em progresso: 1. Em revisão: 1.

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
