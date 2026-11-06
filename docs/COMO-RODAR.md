# Como rodar

Pré-requisitos: Docker e Docker Compose.

```bash
cp .env.example .env      # ajuste JWT_SECRET
docker compose up --build # sobe banco, aplica migrações e inicia a API com hot reload
curl localhost:3000/health   # {"status":"ok"}
```

## Sem Docker (Node 20 + um PostgreSQL local)

```bash
npm install
export DATABASE_URL=postgres://usuario:senha@localhost:5432/elohabits JWT_SECRET=dev
npm run migrate
npm run dev
```

## Comandos úteis

| Comando | O que faz |
|---|---|
| `npm test` | testes unitários |
| `npm run lint` | ESLint |
| `npm run typecheck` | checagem de tipos |
| `npm run build` | compila para `dist/` |
| `npm run migrate` | aplica migrações |
| `npm run migrate:rollback` | desfaz todas as migrações |

## Testes de integração
Os testes de rota usam Postgres. Suba só o banco e aplique as migrações:

```bash
docker compose up -d db   # ou: docker run -p 5432:5432 -e POSTGRES_USER=elohabits -e POSTGRES_PASSWORD=elohabits -e POSTGRES_DB=elohabits postgres:16-alpine
export DATABASE_URL=postgres://elohabits:elohabits@localhost:5432/elohabits
npm run migrate && npm test
```
