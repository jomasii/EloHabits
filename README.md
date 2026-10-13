# EloHabits 

> O elo que mantém sua rotina: rastreador de hábitos baseado em compromisso mútuo onde a sequência só avança se a dupla cumprir a meta.

## Descrição do Projeto
Aplicação de gerenciamento de hábitos, desenvolvido comx para a disciplina de Processos de Software (DIM0510), ministrada pelo professor Dr. Fernando Marques Figueira, no curso de Bacharelado em Engenharia de Software da Universidade Federal do Rio Grande do Norte (UFRN).

---
## Equipe

| Integrante | Matrícula | Usuário Github |
| :--- | :--- | :--- |
| João Marcos Silva Fernandes de Freitas | 20230052103 | [Jomasii](https://github.com/jomasii) |

---

## Informações Adicionais

* **Coorte de apresentação:** B 
* **Integração com outras matérias:** N/A
* **Link do quadro no GitHub Projects:** [EloHabits Kanban](https://github.com/users/jomasii/projects/2)


---

## Como rodar

```bash
cp .env.example .env && docker compose up --build
```

Detalhes em [docs/COMO-RODAR.md](docs/COMO-RODAR.md).

## Mapa do repositório

| Caminho | Conteúdo |
| :--- | :--- |
| `src/domain`, `src/api`, `src/infra` | Código da API (Node + Fastify + TypeScript) |
| `src/tests` | Testes unitários |
| `migrations/` | Migrações do banco (Knex) |
| `contratos/openapi.yaml` | Contrato da API |
| `docs/` | Proposta, design da Sprint 0, COMO-RODAR |
| `docs/decisoes/` | ADRs |
| `processo/` | Acordo de processo e backlog |
| `.github/workflows/` | CI |
