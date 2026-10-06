# EloHabits — Design da Sprint 0

Data: 2026-10-05 · Autor: João Freitas (solo) · Status: aguardando revisão

## 1. Intenção e contexto

Rastreador de hábitos em duplas: o streak só avança se os dois cumprirem a meta, e um mascote compartilhado reflete a saúde da dupla. Projeto da disciplina DIM0510 (UFRN), desenvolvido sozinho, 2–3 dias por semana.

**Prazos**
- Fim da Sprint 0: 15 ou 16 de outubro de 2026.
- MVP final: 2 de dezembro de 2026.

**Núcleo irredutível do MVP:** autenticação, vínculo de dupla e check-in diário. Mascote e dashboard vêm depois, se houver tempo.

**Referências de processo:** repositórios `fmarquesfilho/processos-2026-2` (exigências da disciplina) e `fmarquesfilho/musi` (projeto-exemplo: `processo/`, `docs/decisoes/`, CI, ADRs, contratos).

**Critério de sucesso da Sprint 0:** ao final, o repositório roda localmente com `docker compose up`, tem CI verde, esquema de banco versionado, documentação de processo e decisões escritas, e backlog pronto no GitHub Projects. Isso deixa a Sprint 1 livre para entregar fatias verticais de valor.

## 2. Decisões de stack (resultado do brainstorming)

| Camada | Escolha | Motivo |
|---|---|---|
| Backend | Node.js 20 LTS + TypeScript + Fastify | Menor atrito para quem tem poucas horas por semana |
| Banco | PostgreSQL 16 | Domínio relacional: usuários, duplas, hábitos, check-ins |
| Acesso a dados / migrações | Knex (migrações e query builder) | Simples, sem ORM pesado |
| Autenticação | E-mail + senha, bcrypt, JWT | Conforme a proposta; login social fica fora do MVP |
| Deploy | Docker (Dockerfile multistage + docker-compose) | Exigência da disciplina |
| CI | GitHub Actions | Padrão do MUSI |

Observação: o usuário havia cogitado Kotlin + MongoDB. A troca para Node + Fastify + PostgreSQL foi decisão explícita dele, tomada por prazo e por o domínio ser relacional. Isso vira a ADR-0001.

## 3. Escopo da Sprint 0

**Entra**
1. Ambiente: `.devcontainer`, `docker-compose.yml`, `Dockerfile` multistage, `.env.example`.
2. Esqueleto do código (`src/domain`, `src/api`, `src/infra`, `src/tests`), `tsconfig`, ESLint, hot reload com `tsx watch`, endpoint `/health`.
3. Migrações iniciais: `users`, `pairs`, `habits`, `checkins`.
4. Infraestrutura de auth: módulos de JWT e hash de senha, middleware de autenticação, com testes unitários. Rotas de auth ficam para a Sprint 1.
5. CI: build, lint, testes unitários, build da imagem Docker.
6. Documentação: `docs/proposta.md` (até 5 páginas, 7 seções), ADRs 0001–0004, `docs/COMO-RODAR.md`, README com mapa do repositório.
7. Processo: `processo/acordo-de-processo.md` (cadência, cerimônias, Definição de Pronto, papéis, ferramentas, WIP), `processo/backlog.md`.
8. GitHub Projects: campos Tipo, Componente, Tamanho, Risco, Sprint; colunas conforme `SPRINT-0.md`; no mínimo 5 histórias priorizadas, ao menos 3 estimadas, em fatias verticais.
9. Contrato: `contratos/openapi.yaml` com os endpoints do núcleo (stubs).

**Fica fora:** implementação das rotas, deploy em produção, mascote, dashboard, cliente móvel.

## 4. Modelo de dados inicial

- `users(id, email único, senha_hash, criado_em)`
- `pairs(id, codigo_convite único, usuario_a_id, usuario_b_id nulo até o aceite, criado_em)`
- `habits(id, usuario_id, pair_id, descricao, criado_em)`; no MVP, 1 hábito por usuário
- `checkins(id, habit_id, usuario_id, data, concluido, criado_em)`; único por (habit_id, data)

Regra do streak (a ser detalhada na ADR-0004): o dia só conta para a dupla se os dois membros tiverem check-in concluído. A "virada de dia" usa fuso explícito, a definir na ADR.

## 5. Histórias candidatas do backlog (fatias verticais)

- P1 Criar conta com e-mail e senha
- P1 Entrar e permanecer autenticado
- P1 Criar dupla e gerar código de convite
- P1 Aceitar convite e formar a dupla
- P1 Cadastrar meu hábito diário
- P1 Fazer check-in do dia e ver o status da dupla
- P2 Ver streak da dupla
- P2 Mascote com três estados

## 6. Cronograma (2–3 dias por semana, ~20 h)

| Data | Foco |
|---|---|
| 05–07/out | Ambiente, esqueleto, `/health`, CI mínimo |
| 08–09/out | Migrações, módulos de auth com testes |
| 10–12/out | ADRs, proposta, acordo de processo, definição de pronto |
| 13–14/out | GitHub Projects, backlog, OpenAPI, COMO-RODAR |
| 15–16/out | Revisão final, vídeo/entrega, folga |

## 7. Riscos e pontos em aberto

- **Cliente móvel não definido.** A proposta menciona app Android (Expo Go). Esta spec cobre só o backend; a escolha do cliente (por exemplo React Native/Expo) precisa de ADR antes da Sprint 2. Confirmar se o `proposta.md` atual deve ser atualizado para refletir isso.
- **Proposta atual cita TypeScript e Expo**, coerente com a stack escolhida; não cita backend. A seção de stack precisa ser completada.
- **Horas limitadas:** se o cronograma apertar, corta-se primeiro o OpenAPI e depois as ADRs 0002–0004 (que podem ser curtas).
- **Fuso e virada de dia** do streak: decisão pendente (ADR-0004).

## 8. Verificação

Sprint 0 está pronta quando: `docker compose up` sobe API e banco; `/health` responde; migrações aplicam do zero; testes de JWT e hash passam; CI está verde no `main`; a Definição de Pronto está escrita e o quadro tem o backlog.
