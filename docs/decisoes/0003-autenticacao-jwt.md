# ADR-0003 — Autenticação com e-mail/senha, bcrypt e JWT

Status: aceita · Data: 2026-10-05

## Decisão
- Senhas armazenadas como hash bcrypt (`bcryptjs`, 10 rounds; sem dependência nativa no build Alpine).
- Sessão via JWT assinado (HS256) com `sub` = id do usuário e expiração configurável (`JWT_EXPIRES_IN`, padrão 7d).
- Middleware `authenticate` lê `Authorization: Bearer <token>`.
- Login social fica fora do MVP.

## Consequências
- Sem estado de sessão no servidor; revogação antes da expiração não é suportada no MVP.
- `JWT_SECRET` é obrigatório e nunca versionado.
- Rotas de cadastro/login são da Sprint 1; a Sprint 0 entrega apenas os módulos e o middleware, com testes.
