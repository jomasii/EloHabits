# EloHabits — Design do MVP e da entrega final

Data: 2026-11-06 · Prazo final: 2026-11-30, 23:59 · Autor: João Freitas (solo)

## 1. Contexto e objetivo

Entregar até 30/11 o MVP completo do EloHabits (API + app Android em Expo) cumprindo os critérios da Sprint 2 da disciplina DIM0510: CI com proteção da `main`, `docker compose`, métricas DORA, mapa de fluxo de valor (VSM), melhoria medida, retrospectiva final e vídeo de 5 minutos.

### Estado de partida (verificado em 2026-11-06)
- Sprint 0 concluída (issue #1 fechada em 13/10). API Fastify/TypeScript, 4 migrações (users, pairs, habits, checkins), JWT, bcrypt, CI e compose existem. Rotas implementadas: apenas `/health` e `/me`.
- Sprint 1 (prazo 16/10) não foi entregue: sem incremento, sem `docs/retrospectiva-01.md`, sem vídeo. **Decisão:** a Sprint 1 vira documentação honesta, escrita agora com a data real, e serve de base para a Sprint 2.
- Quadro (GitHub Projects #2): colunas Backlog / In progress / Done; 3 cartões em "In progress" (#2, #5, #6) com WIP declarado de 1; sem `Start date` nem `Target date`; issue #4 fora do quadro; PRs #9 e #10 sem revisão, #9 aberto por 7 dias.
- `gh` autenticado com escopo `read:project`. `main` sem proteção.

### Restrições
- Trabalho solo, ~24 dias, capacidade de 2–3 dias/semana.
- Critérios que supõem mais de um integrante (revisão por outro, "todos falam") serão declarados como não aplicáveis na retrospectiva.
- Cliente: app Expo/Android (decisão do autor). Ambiente de desenvolvimento já pronto.

## 2. Abordagem

Processo primeiro, produto em seguida, com corte de escopo como válvula de escape (decisão em 20/11).

| Semana | Foco |
|---|---|
| 06–13/11 | Reorganizar quadro; proteção da `main`; compose do zero; API de cadastro/login e dupla (TDD); início do log de fluxo e de `uso-de-ia.md` |
| 13–20/11 | API de hábito, check-in, streak e mascote; app com login e dupla; início da melhoria (T7) até 20/11 |
| 20–27/11 | App de hábito, check-in e tela Início; DORA, VSM; README testado por pessoa de fora |
| 27–30/11 | Retrospectivas, vídeo, congelamento do código |

**Válvula de escape:** se em 20/11 o app estiver atrasado, o mascote vira imagem estática por estado e o dashboard (#8, P3) é cortado.

## 3. API (backend)

Sem migração nova no MVP; o trabalho é implementar as rotas de `contratos/openapi.yaml`.

| Rota | Regra |
|---|---|
| `POST /auth/cadastro` | e-mail válido, senha ≥ 6 caracteres, 409 se e-mail já existe |
| `POST /auth/login` | devolve JWT; 401 para credenciais inválidas |
| `POST /duplas` | cria dupla com código de 6 caracteres e `usuario_b_id` nulo; 409 se o usuário já está em dupla ativa |
| `POST /duplas/aceitar` | vinculação atômica (`UPDATE ... WHERE usuario_b_id IS NULL` em transação); 404 para código inexistente; não aceita o próprio convite; 409 se já estiver em dupla |
| `POST /habitos` | 1 hábito por usuário (UNIQUE); exige dupla |
| `POST /checkins` | data de hoje em `America/Fortaleza` (ADR-0004); idempotente por `(habit_id, data)` |
| `GET /duplas/status` | estado dos dois membros hoje, streak e estado do mascote |

### Domínio puro (`src/domain/`, sem banco, desenvolvido com TDD)
Funções recebem os check-ins e a "data de hoje" e devolvem o resultado.

- **Streak:** um dia só conta se os dois concluíram. Um dia passado fechado sem os dois zera o streak. O dia corrente aberto não quebra o streak.
- **Mascote** (derivado, não armazenado):
  - **Feliz:** os dois concluíram o check-in hoje. Um check-in isolado não torna o mascote Feliz.
  - **Faminto:** o dia está aberto, falta pelo menos um dos dois e o último dia fechado não quebrou o streak.
  - **Desmaiado:** o último dia fechado quebrou o streak. Permanece assim até os dois concluírem, quando passa direto a Feliz.

## 4. App Expo (Android)

Pasta `app/` no mesmo repositório. Expo + TypeScript + React Navigation.

- **Telas:** (1) Entrar/Criar conta; (2) Dupla (criar com código e botão de copiar, ou aceitar código); (3) Hábito; (4) Início (mascote, streak em destaque, status dos dois membros, botão "Fiz hoje").
- **Fluxo:** definido pelo estado do usuário — sem token → 1; sem dupla → 2; sem hábito → 3; caso contrário → 4.
- **Camadas:** `api/` (cliente HTTP fino com JWT e tratamento dos erros do contrato); token em `expo-secure-store`; estado do servidor via `GET /duplas/status` ao abrir a tela e em pull-to-refresh. Sem websocket nem push (fora do MVP).
- **Mascote:** 3 imagens estáticas; animação só se sobrar tempo.
- **Testes:** `jest-expo` + React Native Testing Library, sem emulador, no CI.
- **API a partir do celular:** `EXPO_PUBLIC_API_URL` com o IP da máquina na rede local; o README explica.

## 5. Compose, CI e proteção da `main`

### `docker compose`
- Valores padrão inline no `environment:` (`DATABASE_URL`, `JWT_SECRET` de desenvolvimento, `PORT`); `.env` vira override opcional. `docker compose up --build` funciona num clone limpo sem passo manual.
- Healthcheck da API em `/health`; `depends_on: service_healthy` para o `db` (já existente).
- `compose.yaml` sobe a imagem `prod`; `compose.dev.yaml` opcional mantém o fluxo com bind mount.
- O app Expo fica fora do compose; o README tem dois blocos (API via compose; app via `npx expo start`).

### CI (GitHub Actions)
- `npm ci` no lugar de `npm install`.
- Jobs: `verificar` (lint, typecheck, testes da API), `app` (lint, typecheck e testes do Expo), `docker` (build da imagem), e smoke test do compose (sobe a stack, espera healthcheck, `curl /health`).
- Badge de CI no README.

### Proteção da `main`
- PR obrigatório; jobs `verificar`, `app` e `docker` como status checks obrigatórios; aplicado também a administradores (`enforce_admins`). Aplicada e verificada com `gh api`.
- Prova: PR de teste com um teste falhando de propósito, mostrando o merge bloqueado; link e screenshot guardados em `docs/`. O PR só é aberto após aprovação explícita do autor.

## 6. Medição, melhoria, retrospectivas e vídeo

### Quadro (Sprint 1, tarefas T1/T2/T5)
- Criar colunas Sprint Backlog e Em revisão; escrever política de entrada/saída e WIP por coluna; adicionar a issue #4; devolver dois dos três cartões em andamento ao Backlog; preencher `Start date` e `Target date` a partir de agora.
- Ordem de implementação respeitando WIP 1: #2 (cadastro/login) → #4 e aceite do convite → #5 → #6 → #7 → #8.

### Definição de deployment
Merge na `main` com CI verde (o projeto não fica no ar). Registrada em `docs/metricas-02.md`.

### DORA (`docs/metricas-02.md`)
Três métricas reproduzíveis com `gh` e `git`, via `scripts/dora.sh`:
1. Lead time de mudança (primeiro commit do PR → merge), distribuição por PR.
2. Frequência de deployment (merges com CI verde por semana).
3. Taxa de falha de mudança (merges seguidos de PR de correção ou CI vermelho na `main`).

Cada uma documenta definição, comandos, período, valor, limitações e interpretação. O período anterior a novembro fica de fora, declarado como limitação. Meta: 12–15 PRs integrados até 27/11, um por história ou subtarefa, nenhum commit direto na `main`.

### VSM (`docs/fluxo-de-valor.md`)
- Diagrama em Mermaid: ideia → cartão → branch → PR → CI → auto-revisão → merge.
- Tempos de processamento e de espera em ≥ 3 itens concluídos, com a fonte de cada número (estimativas marcadas); lead time e eficiência de fluxo por item e na média, em horas corridas.
- Um gargalo sustentado por número (hipótese inicial: espera de revisão, já indicada pelo PR #9 de 7 dias) e uma melhoria com meta, dono, prazo e métrica.

### Melhoria (T7)
Hipótese inicial: bloco diário fixo de revisão para reduzir a espera mediana do PR. Dono: autor. Deve começar até 20/11 e rodar ≥ 1 semana; o resultado é registrado mesmo se não ajudar. A hipótese é confirmada ou trocada com os dados da semana 2.

### Documentação de processo
- `docs/retrospectiva-01.md`: escrita em novembro, datada, com fatos reais (WIP estourado com 3 cartões em paralelo, PR de 7 dias, ausência de datas de início, Sprint 1 não entregue no prazo), causas (5 Porquês), até 3 ações com dono e prazo verificáveis na retro 02, e revisão do acordo de processo. Limitações declaradas: métricas de fluxo da Sprint 1 só cobrem o que o quadro registrou.
- XP: TDD no domínio (commit de teste antes do commit de implementação) e CI em todo PR, registrado no acordo de processo.
- `docs/uso-de-ia.md`: entradas curtas por tarefa desde o início (o que foi pedido, o que ajudou, o que atrapalhou).
- `docs/retrospectiva-02.md` (27–29/11): verifica cada ação da retro 01 com evidência, compara Sprint 1 × DORA × VSM com números e avalia o uso de IA. Declara os critérios não aplicáveis por ser trabalho solo.
- Vídeo de ~5 min (gravado em 28–29/11, de um clone limpo), com link no README.

## 7. Critérios de sucesso
1. `docker compose up --build` sobe API + Postgres do zero; app roda via Expo Go; um terceiro executa o README em < 10 minutos.
2. Fluxo completo funciona de ponta a ponta: cadastro → login → dupla → hábito → check-in → status/streak/mascote.
3. `main` protegida e provada; CI verde na `main` em 30/11.
4. `metricas-02.md`, `fluxo-de-valor.md`, `retrospectiva-01.md`, `retrospectiva-02.md`, `uso-de-ia.md`, licença e vídeo presentes e linkados.
5. Melhoria da T7 medida por ≥ 1 semana com antes/depois registrados.

## 8. Riscos
- Prazo apertado para produto e processo; mitigado pela ordem processo-primeiro e pelo corte em 20/11.
- Poucos PRs até agora; mitigado por PRs pequenos e frequentes sob proteção da `main`.
- O avaliador precisa de Expo Go ou emulador; o README documenta ambos.
- Dados de fluxo da Sprint 1 incompletos; declarado, não reconstruído.
