# EloHabits MVP e entrega final — Plano de implementação

> **Para agentes:** SUB-SKILL OBRIGATÓRIA: use superpowers:subagent-driven-development (recomendado) ou superpowers:executing-plans para executar este plano tarefa a tarefa. Os passos usam checkbox (`- [ ]`).

**Objetivo:** Entregar até 30/11/2026 o MVP (API + app Expo) e a documentação de processo exigida pela Sprint 2.

**Arquitetura:** API Fastify existente ganha rotas finas sobre repositórios Knex e um domínio puro (streak, mascote, fuso) testado por TDD. App Expo em `app/` consome a API por um cliente HTTP fino. Cada tarefa vira uma branch e um PR pequeno, com a `main` protegida.

**Stack:** Node 20, TypeScript, Fastify 4, Knex/Postgres 16, `node:test` + `tsx`; Expo, React Navigation, `expo-secure-store`, `jest-expo`; GitHub Actions; `gh`.

**Spec:** `docs/2026-11-06-elohabits-mvp-final-design.md`

## Global Constraints

- Fuso fixo `America/Fortaleza` definido em um único ponto (`src/domain/tempo.ts`), conforme ADR-0004.
- Senha com no mínimo 6 caracteres; código de convite com 6 caracteres; 1 hábito por usuário; 1 dupla ativa por usuário.
- Erros da API no formato `{ "erro": string }`.
- Um PR por tarefa, nenhum commit direto na `main`, WIP 1 (um cartão em "In progress" por vez). Cada PR usa o checklist de auto-revisão de `processo/acordo-de-processo.md`.
- Mensagens de commit no padrão do repo: `#<issue> :emoji: tipo: descrição`.
- Textos de produto e documentação em português do Brasil.

## Review Focus

- Virada de dia: 02:59:59Z de 07/11 ainda é 06/11 em Fortaleza; 03:00:00Z já é 07/11 (Tarefa 5).
- Duas requisições simultâneas de `aceitar` o mesmo código: só uma vence, a outra recebe 409 (Tarefa 4).
- Check-in sem hábito ou sem dupla completa: erro 409, nunca 500 (Tarefa 6).
- Check-in repetido no mesmo dia: continua 1 linha e não falha (Tarefa 6).
- E-mail com maiúsculas e espaços ("  A@X.com ") duplica conta: deve ser normalizado e dar 409 (Tarefa 3).

---

## Estrutura de arquivos

| Arquivo | Responsabilidade |
|---|---|
| `src/domain/tempo.ts` | `hojeFortaleza`, `ontem` (únicos pontos de data) |
| `src/domain/streak.ts` | `calcularStreak` |
| `src/domain/mascote.ts` | `estadoMascote` |
| `src/infra/repos/*.ts` | acesso a dados por agregado (users, pairs, habits, checkins) |
| `src/api/routes/*.ts` | uma rota/grupo por arquivo (`auth`, `duplas`, `habitos`, `checkins`) |
| `src/api/server.ts` | `buildApp({ jwtSecret, jwtExpiresIn, db })` registra as rotas |
| `src/tests/helpers/db.ts` | `testDb()`, `resetDb(db)` |
| `app/` | app Expo |
| `scripts/dora.sh` | coleta das métricas DORA |

---

### Task 1: Quadro, política das colunas e acordo de processo

Cobre as tarefas T1/T2/T5 da Sprint 1. Parte é manual na interface do GitHub, porque `gh` não edita as opções do campo Status.

**Files:**
- Modify: `processo/acordo-de-processo.md`, `processo/backlog.md`

- [ ] **Step 1 (manual, você): no quadro https://github.com/users/jomasii/projects/2**, renomear/criar as colunas Backlog, Sprint Backlog, Em progresso, Em revisão e Pronto. Na descrição de cada uma, escrever a política de entrada e de saída; em Em progresso e Em revisão, declarar "WIP: 1".
- [ ] **Step 2 (manual): adicionar a issue #4 ao quadro**, devolver #5 e #6 ao Backlog (deixando #2 em Em progresso) e mover #4 e #5 para Sprint Backlog. Preencher `Start date` e `Target date` do cartão #2.
- [ ] **Step 3:** em `processo/acordo-de-processo.md`, acrescentar a seção "Política das colunas" com os mesmos critérios do quadro e a seção "Prática XP" declarando TDD no domínio e CI em todo PR.
- [ ] **Step 4:** em `processo/backlog.md`, acrescentar a coluna "Issue" com #2, #4, #5, #6, #7, #8.
- [ ] **Step 5: Verificar o quadro**

Run: `gh project item-list 2 --owner jomasii --format json | jq '[.items[] | select(.status=="Em progresso")] | length'`
Expected: `1`

- [ ] **Step 6: Commit e PR** na branch `docs/quadro-e-processo` (`#1 :memo: docs: política das colunas e prática XP`).

### Task 2: Compose do zero, CI endurecido e proteção da `main`

**Files:**
- Modify: `.github/workflows/ci.yml`, `Dockerfile`, `docker-compose.yml` (renomear para `compose.yaml`), `.env.example`, `docs/COMO-RODAR.md`
- Create: `compose.dev.yaml`, `scripts/smoke-compose.sh`

**Interfaces:**
- Produces: jobs de CI chamados `verificar`, `docker` e `compose-smoke` (nomes usados na proteção da `main`).

- [ ] **Step 1:** em `compose.yaml`, usar `target: prod`, valores padrão inline em `environment:` (`DATABASE_URL`, `PORT`, `JWT_SECRET`) e remover `env_file` obrigatório. O `JWT_SECRET` padrão precisa ter ≥ 32 caracteres e **não** começar com `troque-por`, senão `loadConfig` rejeita a imagem `prod`. Healthcheck da API: `wget -qO- http://localhost:3000/health`. Manter `depends_on: db: condition: service_healthy`.
- [ ] **Step 2:** mover o fluxo com bind mount e `target: dev` para `compose.dev.yaml`.
- [ ] **Step 3:** no `Dockerfile`, trocar `npm install` por `npm ci`.
- [ ] **Step 4:** escrever `scripts/smoke-compose.sh`: `docker compose up -d --build --wait`, `curl -fsS localhost:3000/health`, `docker compose down -v`. Sair com código ≠ 0 em qualquer falha.
- [ ] **Step 5:** em `ci.yml`, trocar `npm install` por `npm ci`, e adicionar o job `compose-smoke` que executa o script.
- [ ] **Step 6: Verificar a partir de um clone limpo**

Run: `git clone . /tmp/claude-1000/-home-joao-Documents-EloHabits/4c2afc33-ef29-4cd9-9a87-f84cb2ed2725/scratchpad/clone && cd $_ && bash scripts/smoke-compose.sh`
Expected: termina com código 0 e imprime `{"status":"ok"}`.

- [ ] **Step 7: Commit e PR.** Depois do merge (CI verde), aplicar a proteção:

```bash
gh api -X PUT repos/jomasii/EloHabits/branches/main/protection --input - <<'EOF'
{"required_status_checks":{"strict":true,"contexts":["verificar","docker","compose-smoke"]},
 "enforce_admins":true,
 "required_pull_request_reviews":{"required_approving_review_count":0},
 "restrictions":null}
EOF
```

- [ ] **Step 8: Verificar**: `gh api repos/jomasii/EloHabits/branches/main/protection --jq '.enforce_admins.enabled'` → `true`.
- [ ] **Step 9: Provar o bloqueio** (peça aprovação antes de abrir o PR): branch `teste/bloqueio-ci` com um teste que falha de propósito, abrir PR, confirmar que o merge fica bloqueado, guardar o link e o screenshot em `docs/evidencias/protecao-main.md`, fechar o PR sem merge.

### Task 3: Infra de teste com banco e rotas de cadastro/login (#2)

**Files:**
- Create: `src/tests/helpers/db.ts`, `src/infra/repos/users.ts`, `src/api/routes/auth.ts`, `src/tests/auth-routes.test.ts`
- Modify: `src/api/server.ts`, `src/index.ts`, `.github/workflows/ci.yml` (serviço Postgres + `DATABASE_URL` + `npm run migrate` antes dos testes), `src/tests/api.test.ts` (passa `db`)

**Interfaces:**
- Produces: `buildApp(opts: { jwtSecret: string; jwtExpiresIn: string; db: Knex }): FastifyInstance`; `testDb(): Knex` (lê `DATABASE_URL`); `resetDb(db: Knex): Promise<void>` (`TRUNCATE users, pairs, habits, checkins RESTART IDENTITY CASCADE`); `criarUsuario(db, email, senhaHash): Promise<{id:string}>`; `buscarUsuarioPorEmail(db, email): Promise<{id:string; senha_hash:string}|undefined>`.

- [ ] **Step 1: Testes que falham** em `auth-routes.test.ts` (cada um chama `resetDb` antes):
  - `cadastro válido retorna 201`
  - `cadastro com senha curta (5 caracteres) retorna 400`
  - `cadastro com e-mail inválido retorna 400`
  - `cadastro com e-mail repetido retorna 409`
  - `e-mail é normalizado: "  A@X.com " e "a@x.com" colidem (409)`
  - `login válido retorna 200 com token que passa em /me`
  - `login com senha errada retorna 401`
- [ ] **Step 2:** Run `DATABASE_URL=postgres://elohabits:elohabits@localhost:5432/elohabits npm test` (suba antes só o banco: `docker compose up -d db` e `npm run migrate`). Expected: FAIL.
- [ ] **Step 3:** Implementar as rotas `POST /auth/cadastro` (201 `{id}`) e `POST /auth/login` (200 `{token}`). Normalizar e-mail com `trim().toLowerCase()`; 400 com `{erro}` para validação; 409 `{erro:"e-mail já cadastrado"}` capturando a violação do `UNIQUE` (código Postgres `23505`) em vez de consultar antes.
- [ ] **Step 4:** Run `npm test && npm run lint && npm run typecheck`. Expected: PASS.
- [ ] **Step 5: Commit e PR** (`#2 :sparkles: feat: cadastro e login`). Mover o cartão #2 para Em revisão e depois para Pronto.

### Task 4: Dupla e convite (#4)

**Files:**
- Create: `src/infra/repos/pairs.ts`, `src/api/routes/duplas.ts`, `src/tests/duplas.test.ts`
- Modify: `src/api/server.ts`

**Interfaces:**
- Consumes: `buildApp`, `testDb`, `resetDb`, `signToken` (Tarefa 3).
- Produces: `criarDupla(db, usuarioId): Promise<{id:string; codigo:string}>`; `aceitarConvite(db, usuarioId, codigo): Promise<"ok"|"inexistente"|"propria"|"ja_preenchida">`; `buscarDuplaDoUsuario(db, usuarioId): Promise<{id:string; codigo:string; usuarioAId:string; usuarioBId:string|null}|undefined>`.

- [ ] **Step 1: Testes que falham** em `duplas.test.ts`:
  - `POST /duplas retorna 201 com código de 6 caracteres [A-Z0-9]`
  - `usuário já em dupla recebe 409 ao criar outra`
  - `aceitar com código inexistente retorna 404`
  - `aceitar o próprio convite retorna 409`
  - `aceitar convite forma a dupla (200) e o convite não pode ser reutilizado (409)`
  - `usuário que já está em dupla não pode aceitar outro convite (409)`
  - `duas requisições simultâneas de aceitar o mesmo código: exatamente uma retorna 200 e a outra 409` (`Promise.all` com dois usuários)
  - `sem token retorna 401`
- [ ] **Step 2:** Run `npm test`. Expected: FAIL.
- [ ] **Step 3:** Implementar. `aceitarConvite` roda em transação com `UPDATE pairs SET usuario_b_id = ? WHERE codigo_convite = ? AND usuario_b_id IS NULL AND usuario_a_id <> ?` e olha o número de linhas afetadas; verifica antes que o usuário não está em nenhuma dupla. Gerar o código com `crypto.randomInt` sobre o alfabeto `A-Z0-9` e repetir se violar o `UNIQUE`.
- [ ] **Step 4:** Run `npm test && npm run lint && npm run typecheck`. Expected: PASS.
- [ ] **Step 5: Commit e PR** (`#4 :sparkles: feat: criar dupla e aceitar convite`).

### Task 5: Domínio puro — fuso, streak e mascote (TDD, evidência XP)

Fazer **dois commits por função**: primeiro o teste (falhando), depois a implementação. Isso é a evidência de TDD da retro.

**Files:**
- Create: `src/domain/tempo.ts`, `src/domain/streak.ts`, `src/domain/mascote.ts`, `src/tests/tempo.test.ts`, `src/tests/streak.test.ts`, `src/tests/mascote.test.ts`

**Interfaces:**
- Produces:
  - `hojeFortaleza(agora: Date): string` — data `YYYY-MM-DD` em `America/Fortaleza`.
  - `ontem(dia: string): string` — dia anterior, também `YYYY-MM-DD`.
  - `calcularStreak(diasCompletos: string[], hoje: string): number` — `diasCompletos` são as datas em que **os dois** concluíram. Conta dias consecutivos terminando em `hoje` se `hoje` estiver completo, senão terminando em `ontem(hoje)`; o dia aberto não quebra; se nem `hoje` nem `ontem` estão completos, é 0.
  - `type Mascote = "feliz" | "faminto" | "desmaiado"`
  - `estadoMascote(a: { diasCompletos: string[]; hoje: string; inicioDupla: string }): Mascote` — `feliz` se `hoje` está completo; `desmaiado` se `hoje` não está completo, `ontem(hoje) >= inicioDupla` e `ontem(hoje)` não está completo; `faminto` nos demais casos.

- [ ] **Step 1: Teste de `tempo`** (commit separado): `2026-11-07T02:59:59Z → "2026-11-06"`, `2026-11-07T03:00:00Z → "2026-11-07"`, `ontem("2026-03-01") → "2026-02-28"`, `ontem("2026-01-01") → "2025-12-31"`. Run → FAIL. Implementar com `Intl.DateTimeFormat("en-CA", { timeZone: "America/Fortaleza" })`. Run → PASS. Commits separados.
- [ ] **Step 2: Teste de `streak`**: `[] → 0`; só hoje completo → 1; ontem e anteontem completos com hoje aberto → 2 (dia aberto não quebra); hoje completo + 2 dias anteriores → 3; buraco antes de ontem quebra a contagem; nem hoje nem ontem completos → 0. Run → FAIL; implementar; PASS. Commits separados.
- [ ] **Step 3: Teste de `mascote`**: hoje completo → `feliz`; dupla nova (ontem anterior a `inicioDupla`) com hoje aberto → `faminto`; ontem completo, hoje aberto → `faminto`; ontem incompleto após `inicioDupla`, hoje aberto → `desmaiado`; falta de vários dias → `desmaiado`; nesse caso, hoje completo → `feliz`; só um dos dois concluir **não** muda o resultado (a função só enxerga dias completos). Run → FAIL; implementar; PASS. Commits separados.
- [ ] **Step 4:** Run `npm test && npm run lint && npm run typecheck`. Abrir PR (`#6 :white_check_mark: test: domínio de streak e mascote`).

### Task 6: Hábito e check-in (#5, #6)

**Files:**
- Create: `src/infra/repos/habits.ts`, `src/infra/repos/checkins.ts`, `src/api/routes/habitos.ts`, `src/api/routes/checkins.ts`, `src/tests/habitos.test.ts`, `src/tests/checkins.test.ts`
- Modify: `src/api/server.ts`

**Interfaces:**
- Consumes: `buscarDuplaDoUsuario` (Tarefa 4), `hojeFortaleza` (Tarefa 5).
- Produces: `criarHabito(db, usuarioId, pairId, descricao): Promise<{id:string}>`; `buscarHabito(db, usuarioId): Promise<{id:string; descricao:string}|undefined>`; `registrarCheckin(db, habitId, usuarioId, data: string): Promise<void>` (idempotente por `(habit_id, data)`); `diasCompletosDaDupla(db, pairId): Promise<string[]>` (datas em que os dois membros têm `concluido = true`).

- [ ] **Step 1: Testes de hábito que falham:** `201 com descrição de até 50 caracteres`; `400 com descrição vazia ou com 51 caracteres`; `409 sem dupla completa`; `409 ao criar o segundo hábito do mesmo usuário`.
- [ ] **Step 2: Testes de check-in que falham:** `201 registra hoje (data via hojeFortaleza)`; `409 sem hábito`; `409 sem dupla completa`; `repetir o check-in no mesmo dia retorna 200 e mantém 1 linha`; `o corpo não aceita data (sempre hoje)`; `diasCompletosDaDupla só inclui dias em que os dois concluíram`.
- [ ] **Step 3:** Run `npm test`. Expected: FAIL.
- [ ] **Step 4:** Implementar. "Dupla completa" = `usuario_b_id` não nulo. Usar `INSERT ... ON CONFLICT (habit_id, data) DO NOTHING`. `POST /checkins` não lê data do corpo.
- [ ] **Step 5:** Run `npm test && npm run lint && npm run typecheck`. Expected: PASS.
- [ ] **Step 6: Commit e PR** (um PR por issue: `#5 ...` e `#6 ...`, respeitando WIP 1).

### Task 7: Status da dupla (#7)

**Files:**
- Create: `src/api/routes/status.ts`, `src/tests/status.test.ts`
- Modify: `src/api/server.ts`, `contratos/openapi.yaml`

**Interfaces:**
- Consumes: `buscarDuplaDoUsuario`, `buscarHabito`, `diasCompletosDaDupla`, `calcularStreak`, `estadoMascote`, `hojeFortaleza`.
- Produces: `GET /duplas/status` → 200 sempre:
```ts
interface StatusDupla {
  dupla: { codigo: string; completa: boolean } | null;
  streak: number;
  mascote: "feliz" | "faminto" | "desmaiado";
  eu: { temHabito: boolean; concluidoHoje: boolean };
  parceiro: { temHabito: boolean; concluidoHoje: boolean } | null;
}
```
`inicioDupla` = data (Fortaleza) de `pairs.criado_em`.

- [ ] **Step 1: Testes que falham:** `sem dupla: dupla null, streak 0, parceiro null`; `dupla incompleta: completa false e parceiro null`; `dupla completa e ninguém fez check-in: faminto`; `os dois fizeram hoje: feliz e streak 1`; `só eu fiz: faminto e eu.concluidoHoje true, parceiro.concluidoHoje false`; `ontem quebrou (inserindo check-ins com data fixa): desmaiado`.
- [ ] **Step 2:** Run `npm test`. Expected: FAIL. Para controlar o "hoje" nos testes, `buildApp` aceita `agora?: () => Date` (padrão `() => new Date()`).
- [ ] **Step 3:** Implementar a rota e atualizar `openapi.yaml` com os schemas e as respostas reais de todas as rotas das Tarefas 3–7.
- [ ] **Step 4:** Run `npm test && npm run lint && npm run typecheck`. Expected: PASS.
- [ ] **Step 5: Commit e PR** (`#7 :sparkles: feat: status da dupla`).

### Task 8: Esqueleto do app Expo e job `app` no CI

**Files:**
- Create: `app/` (via `npx create-expo-app@latest app --template blank-typescript`), `app/src/api/client.ts`, `app/src/api/client.test.ts`, `app/.env.example`
- Modify: `.github/workflows/ci.yml`

**Interfaces:**
- Produces: `createApiClient(baseUrl: string, getToken: () => Promise<string | null>)` com os métodos `cadastro(email, senha)`, `login(email, senha): Promise<{token:string}>`, `criarDupla(): Promise<{codigo:string}>`, `aceitarConvite(codigo)`, `criarHabito(descricao)`, `fazerCheckin()`, `status(): Promise<StatusDupla>`. Respostas não-2xx lançam `ApiError { status: number; mensagem: string }`; falha de rede lança `ApiError` com `status: 0` e mensagem "Sem conexão com o servidor". Os tipos `StatusDupla` e `Mascote` espelham a Tarefa 7.

- [ ] **Step 1:** Criar o app, instalar `@react-navigation/native`, `@react-navigation/native-stack`, `expo-secure-store`, `jest-expo`, `@testing-library/react-native`; scripts `lint`, `typecheck`, `test`.
- [ ] **Step 2: Testes do cliente que falham** (com `fetch` simulado): `injeta Authorization: Bearer <token> quando há token`; `não envia Authorization sem token`; `status 409 vira ApiError com a mensagem do campo erro`; `falha de rede vira ApiError status 0`.
- [ ] **Step 3:** Run `cd app && npm test`. Expected: FAIL. Implementar o cliente. Run → PASS.
- [ ] **Step 4:** Adicionar o job `app` ao CI (`working-directory: app`, `npm ci`, lint, typecheck, test). Depois do merge, adicionar `app` aos checks obrigatórios: `gh api -X PATCH repos/jomasii/EloHabits/branches/main/protection/required_status_checks --field 'contexts[]=verificar' --field 'contexts[]=docker' --field 'contexts[]=compose-smoke' --field 'contexts[]=app'`.
- [ ] **Step 5: Commit e PR** (`#2 :tada: feat: esqueleto do app Expo`).

### Task 9: Telas de autenticação e navegação por estado

**Files:**
- Create: `app/src/auth/AuthContext.tsx`, `app/src/screens/EntrarScreen.tsx`, `app/src/navigation/Rotas.tsx`, testes `*.test.tsx` ao lado

**Interfaces:**
- Consumes: `createApiClient` (Tarefa 8).
- Produces: `AuthContext` com `{ token: string | null; entrar(email, senha): Promise<void>; sair(): Promise<void> }`, token guardado em `expo-secure-store` (chave `elohabits_token`); `Rotas` escolhe a tela por `StatusDupla`: sem token → `Entrar`; `dupla === null || !dupla.completa` → `Dupla`; `!eu.temHabito` → `Habito`; senão `Inicio`.

- [ ] **Step 1: Testes que falham:** `EntrarScreen mostra erro para e-mail inválido e para senha com menos de 6 caracteres sem chamar a API`; `login bem-sucedido guarda o token no SecureStore`; `erro da API é mostrado em texto`; `Rotas: cada combinação de estado leva à tela correta` (4 casos).
- [ ] **Step 2:** Run `cd app && npm test`. Expected: FAIL.
- [ ] **Step 3:** Implementar. Tela com alternância Entrar/Criar conta; mensagem amigável quando `ApiError.status === 0`.
- [ ] **Step 4:** Run `cd app && npm test && npm run lint && npm run typecheck`. Expected: PASS.
- [ ] **Step 5: Teste manual no celular** com Expo Go e `EXPO_PUBLIC_API_URL=http://<IP-da-máquina>:3000`: criar conta e entrar.
- [ ] **Step 6: Commit e PR.**

### Task 10: Telas Dupla, Hábito e Início

**Files:**
- Create: `app/src/screens/DuplaScreen.tsx`, `HabitoScreen.tsx`, `InicioScreen.tsx`, `app/assets/mascote-{feliz,faminto,desmaiado}.png`, testes ao lado

**Interfaces:**
- Consumes: métodos do cliente e `StatusDupla`.

- [ ] **Step 1: Testes que falham:** `Dupla: criar mostra o código de 6 caracteres e o botão Copiar`; `Dupla: aceitar com código inválido mostra o erro 404 em texto`; `Habito: bloqueia texto vazio ou com mais de 50 caracteres`; `Inicio: renderiza a imagem do mascote correspondente a cada um dos 3 estados`; `Inicio: mostra o streak em destaque e Pendente/Concluído para os dois membros`; `Inicio: botão "Fiz hoje" chama fazerCheckin e recarrega o status`; `Inicio: pull-to-refresh recarrega o status`.
- [ ] **Step 2:** Run `cd app && npm test`. Expected: FAIL.
- [ ] **Step 3:** Implementar. Imagens estáticas por estado (válvula de escape do spec; animação só se sobrar tempo).
- [ ] **Step 4:** Run `cd app && npm test && npm run lint && npm run typecheck`. Expected: PASS.
- [ ] **Step 5: Teste manual ponta a ponta com dois dispositivos/usuários** (cadastro → dupla → hábito → check-in dos dois → mascote Feliz). Registrar no PR.
- [ ] **Step 6: Um PR por tela** (`#4`, `#5`, `#7`), respeitando WIP 1.

### Task 11: Dashboard (#8) — opcional, decidido em 20/11

**Files:** a definir **somente** se, em 20/11, as Tarefas 3–10 estiverem concluídas. Caso contrário, mover #8 para o Backlog com a nota "cortado por prazo" e registrar na retro 02.

### Task 12: Medição — DORA, VSM e melhoria (T7)

**Files:**
- Create: `scripts/dora.sh`, `docs/metricas-02.md`, `docs/fluxo-de-valor.md`, `docs/log-fluxo.md`

- [ ] **Step 1:** Em `docs/metricas-02.md`, definir "deployment" = merge na `main` com CI verde e o período de medição (a partir de 06/11).
- [ ] **Step 2:** Escrever `scripts/dora.sh` imprimindo, a partir de `gh pr list --state merged --json number,createdAt,mergedAt,commits` e `gh run list --branch main --json conclusion,createdAt`: lead time por PR (primeiro commit → merge), merges por semana e a taxa de falha (execuções `failure` na `main` ÷ total).
- [ ] **Step 3: Verificar a reprodutibilidade:** Run `bash scripts/dora.sh` duas vezes. Expected: saídas idênticas.
- [ ] **Step 4:** Documentar em `docs/metricas-02.md` definição, comandos, período, valores (distribuição por semana e por PR), limitações e interpretação.
- [ ] **Step 5:** Manter `docs/log-fluxo.md` a cada PR: datas de início, PR aberto, CI verde, revisão e merge.
- [ ] **Step 6 (até 20/11): iniciar a melhoria da T7.** Em `docs/fluxo-de-valor.md`, registrar a hipótese inicial (bloco diário fixo de revisão), o dono, o prazo, a métrica (espera mediana do PR), o valor-alvo e o valor antes. Rodar ≥ 7 dias.
- [ ] **Step 7 (até 27/11):** completar o diagrama Mermaid, os tempos de processamento e espera de ≥ 3 itens, a eficiência de fluxo, o gargalo com número e o resultado depois da melhoria.
- [ ] **Step 8: PRs** (`docs`).

### Task 13: Fechamento — README, retrospectivas, uso de IA e vídeo

**Files:**
- Create: `docs/retrospectiva-01.md`, `docs/retrospectiva-02.md`, `docs/uso-de-ia.md`
- Modify: `README.md`, `docs/COMO-RODAR.md`

- [ ] **Step 1 (desde já e a cada tarefa):** manter `docs/uso-de-ia.md` com uma entrada curta por tarefa: o que foi pedido, o que ajudou, o que atrapalhou.
- [ ] **Step 2 (até 13/11):** escrever `docs/retrospectiva-01.md` datada de novembro, com fatos reais (WIP estourado com 3 cartões em paralelo, PR #9 aberto por 7 dias, ausência de datas de início, Sprint 1 não entregue em 16/10), causas por 5 Porquês, no máximo 3 ações com dono e prazo e a revisão do acordo de processo. Declarar as limitações dos dados.
- [ ] **Step 3 (até 27/11):** README com badge de CI, pré-requisitos, `docker compose up --build`, `cd app && npm install && npx expo start`, `EXPO_PUBLIC_API_URL`, o que esperar e o link do vídeo. Licença já existe (`LICENSE`).
- [ ] **Step 4:** pedir a alguém de fora que siga o README do zero, cronometrar (< 10 minutos) e registrar o resultado em `docs/evidencias/readme-teste.md`.
- [ ] **Step 5 (27–29/11):** escrever `docs/retrospectiva-02.md`: verificação de cada ação da retro 01 com evidência, comparação Sprint 1 × DORA × VSM com números, avaliação do uso de IA e até 3 ações. Declarar os critérios não aplicáveis por ser trabalho solo.
- [ ] **Step 6 (28–29/11): gravar o vídeo de ~5 minutos** a partir de um clone limpo, seguindo o roteiro do guia, e linkar no README.
- [ ] **Step 7 (30/11):** verificar CI verde na `main` e o hash do último commit; congelar o código.

---

## Autoverificação

- **Cobertura da spec:** rotas (T3, T4, T6, T7), domínio (T5), app e telas (T8–T10), compose/CI/proteção (T2), quadro (T1), DORA/VSM/T7 (T12), retros/IA/vídeo/README (T13), corte em 20/11 (T11).
- **Consistência de tipos:** `StatusDupla` definido na Tarefa 7 é usado na 8, 9 e 10; `buildApp` ganha `db` na 3 e `agora?` na 7; nomes de jobs de CI definidos na Tarefa 2 e usados nas Tarefas 2 e 8.
- **Ponto de atenção:** a imagem `prod` rejeita `JWT_SECRET` curto ou com prefixo `troque-por`, por isso o Step 1 da Tarefa 2 fixa o valor padrão do compose.
